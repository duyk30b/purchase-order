import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { arrayToKeyValue, uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseOrderHistoryContent } from '../../../../mongo/purchase-order-history/purchase-order-history.constant'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderHistoryInsertType } from '../../../../mongo/purchase-order-history/purchase-order-history.schema'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import {
  PurchaseOrderStatus,
  PurchaseOrderType,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../../mongo/purchase-request/purchase-request.schema'
import { IncotermType } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.response'
import { NatsClientIncotermService } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import {
  SUPPLIER_STATUS,
  SupplierItemType,
  SupplierType,
} from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import { NatsClientCostCenterService } from '../../../transporter/nats/service/nats-client-cost-center.service'
import {
  ItemActiveStatusEnum,
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientWarehouseService,
  WarehouseStatusEnum,
  WarehouseType,
} from '../../../transporter/nats/service/nats-client-warehouse.service'

@Injectable()
export class ApiPurchaseOrderConfirmService {
  private logger = new Logger(ApiPurchaseOrderConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientIncotermService: NatsClientIncotermService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService
  ) {}

  async confirm(options: {
    ids: string[]
    userId: number
  }): Promise<BaseResponse> {
    const { ids, userId } = options
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw BusinessException.error({
        message: 'error.FILTER_EMPTY',
        error: [{ ids }],
      })
    }

    const rootList = await this.purchaseOrderRepository.findMany({
      relation: { poDeliveryItems: true, purchaseOrderItems: true },
      condition: { id: { IN: ids } },
    })
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    rootList.forEach((i) => {
      if (![PurchaseOrderStatus.WAIT_CONFIRM].includes(i?.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Đơn mua hàng' })
      }
    })

    await this.validate(rootList)

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const poUpdateCount = await this.purchaseOrderRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseOrderStatus.CONFIRM,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const poHistoryDtoList = rootList.map((po) => {
      const poHistoryDto: PurchaseOrderHistoryInsertType = {
        _purchase_order_id: new Types.ObjectId(po.id),
        userId,
        status: { before: po.status, after: PurchaseOrderStatus.CONFIRM },
        content: PurchaseOrderHistoryContent.CONFIRM,
        time: new Date(),
      }
      return poHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      poHistoryDtoList
    )

    return { data: { ids }, message: 'msg.MSG_188' }
  }

  // TODO
  async validate(purchaseOrderList: PurchaseOrderType[]) {
    const supplierIds = purchaseOrderList.map((i) => i.supplierId)
    const purchaseOrderItems = purchaseOrderList
      .map((i) => i.purchaseOrderItems || [])
      .flat()
    const poDeliveryItems = purchaseOrderList
      .map((i) => i.poDeliveryItems || [])
      .flat()
    const poPaymentPlans = purchaseOrderList
      .map((i) => i.poPaymentPlans || [])
      .flat()

    const incotermIds = purchaseOrderList.map((i) => i.incotermId)
    const purchaseRequestCodes = purchaseOrderList.map(
      (i) => i.purchaseRequestCode
    )
    const contractCodes = purchaseOrderList.map((i) => i.contractCode) // mã hợp đồng

    const itemIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemId),
      ...(poDeliveryItems || []).map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(poDeliveryItems || []).map((i) => i.itemUnitId),
    ])

    const deliveryMethodList = purchaseOrderList.map((i) => i.deliveryMethod) // phương thức vận chuyển
    const paymentMethodList = poPaymentPlans.map((i) => i.paymentMethod) // phương thức thanh toán

    const warehouseIdList = poDeliveryItems.map((i) => i.warehouseIdReceiving) // kho nhận

    const dataExtendsPromise = await Promise.allSettled([
      supplierIds.length
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: supplierIds } },
            relation: { supplierItems: true },
          })
        : {},
      incotermIds && incotermIds.length
        ? this.natsClientIncotermService.incotermGetMap({
            filter: { id: { IN: incotermIds } },
          })
        : {},
      purchaseRequestCodes && purchaseRequestCodes.length
        ? this.purchaseRequestRepository.findManyBy({
            code: { IN: purchaseRequestCodes },
          })
        : [],
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
        : {},
      itemUnitIdList && itemUnitIdList.length
        ? this.natsClientItemService.getItemUnitListByIds({
            unitIds: itemUnitIdList,
          })
        : {},
      warehouseIdList && warehouseIdList.length
        ? this.natsClientWarehouseService.getWarehouseMap({
            ids: warehouseIdList,
          })
        : {},
    ])
    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return []
      }
    }) as [
      Record<string, SupplierType>,
      Record<string, IncotermType>,
      PurchaseRequestType[],
      Record<string, ItemType>,
      ItemUnitType[],
      WarehouseType[],
    ]

    const [
      supplierMap,
      incotermMap,
      purchaseRequestList,
      itemMap,
      itemUnitList,
      warehouseMap,
    ] = dataExtendsResult
    const purchaseRequestMap = arrayToKeyValue(purchaseRequestList, 'code')

    purchaseOrderList.forEach((po) => {
      const supplier = supplierMap[po.supplierId]
      if (!supplier || ![SUPPLIER_STATUS.ACTIVE].includes(supplier.status)) {
        throw new BusinessException('msg.MSG_045')
      }

      const pr = purchaseRequestMap[po.purchaseRequestCode]
      if (!pr || ![PurchaseRequestStatus.CONFIRM].includes(pr.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }

      const incoterm = incotermMap[po.incotermId]
      if (!incoterm || !incoterm.isActive) {
        throw BusinessException.msg('msg.MSG_195', { obj: 'Incoterms' })
      }

      const supplierItemList = supplier.supplierItems || []
      const supplierItemMap: Record<string, SupplierItemType> = {}
      supplierItemList.forEach((i) => (supplierItemMap[i.id] = i))

      po.purchaseOrderItems.forEach((poItem) => {
        const item = itemMap[poItem.itemId]
        const supplierItem = supplierItemMap[poItem.itemId]

        if (
          !item ||
          !supplierItem ||
          ![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)
        ) {
          throw new BusinessException('msg.MSG_195', {
            obj: 'Sản phẩm',
          })
        }
        if (poItem.itemUnitId !== supplierItem.itemUnitId) {
          throw new BusinessException('msg.MSG_298', {
            obj: 'Sản phẩm',
          })
        }

        // TODO: Tổng SL giao kế hoạch khác SL mua: Thông báo mã lỗi MSG_ 059
      })

      // TODO: Phương thức vận chuyển không hoạt động: thông báo mã lỗi MSG_056
      // TODO: Phương thức thanh toán không hoạt động: thông báo mã lỗi MSG_060

      po.poDeliveryItems.forEach((poDelivery) => {
        const warehouse = warehouseMap[poDelivery.warehouseIdReceiving]
        if (
          !warehouse ||
          ![WarehouseStatusEnum.Active].includes(warehouse.status)
        ) {
          throw new BusinessException('msg.MSG_067', {})
        }

        if (poDelivery.deliveryDate.getTime() - po.orderDate.getTime() < 0) {
          throw new BusinessException('msg.MSG_062')
        }
      })
    })
  }
}
