import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import {
  arrayToKeyValue,
  objectEnum,
  uniqueArray,
} from '../../../../common/helpers'
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
import { UserActionRepository } from '../../../../mongo/user-action/user-action.repository'
import { FileService } from '../../../transporter/axios/file.service'
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
export class ApiPurchaseOrderWaitConfirmService {
  private logger = new Logger(ApiPurchaseOrderWaitConfirmService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly fileService: FileService,
    private readonly userActionRepository: UserActionRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientIncotermService: NatsClientIncotermService
  ) {}

  async waitConfirm(options: {
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
      relation: { purchaseOrderItems: true, poDeliveryItems: true },
      condition: { id: { IN: ids } },
    })
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }
    rootList.forEach((i) => {
      if (![PurchaseOrderStatus.DRAFT].includes(i?.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Đơn mua hàng' })
      }
    })

    await this.validate(rootList)

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const poUpdateCount = await this.purchaseOrderRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseOrderStatus.WAIT_CONFIRM,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const poHistoryDtoList = rootList.map((po) => {
      const poHistoryDto: PurchaseOrderHistoryInsertType = {
        _purchase_order_id: new Types.ObjectId(po.id),
        userId,
        status: { before: po.status, after: PurchaseOrderStatus.WAIT_CONFIRM },
        content: PurchaseOrderHistoryContent.WAIT_CONFIRM,
        time: new Date(),
      }
      return poHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      poHistoryDtoList
    )

    return { data: { ids } }
  }

  async validate(data: PurchaseOrderType[]) {
    const supplierIds = data.map((i) => i.supplierId)
    const purchaseOrderItems = data
      .map((i) => i.purchaseOrderItems || [])
      .flat()
    const poDeliveryItems = data.map((i) => i.poDeliveryItems || []).flat()
    const poPaymentPlans = data.map((i) => i.poPaymentPlans || []).flat()

    const incotermIds = data.map((i) => i.incotermId)
    const purchaseRequestCodes = data.map((i) => i.purchaseRequestCode)
    const contractCodes = data.map((i) => i.contractCode) // mã hợp đồng

    const itemIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemId),
      ...(poDeliveryItems || []).map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(poDeliveryItems || []).map((i) => i.itemUnitId),
    ])
    const deliveryMethodList = data.map((i) => i.deliveryMethod) // phương thức vận chuyển
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
      Record<string, WarehouseType>,
    ]

    const [
      supplierMap,
      incotermMap,
      purchaseRequestList,
      itemMap,
      itemUnitList,
      warehouseMap,
    ] = dataExtendsResult

    const itemList = Object.values(itemMap)
    const purchaseRequestMap = arrayToKeyValue(purchaseRequestList, 'code')

    // check từng PO
    data.forEach((po: PurchaseOrderType) => {
      const supplier = supplierMap[po.supplierId]
      if (!supplier || ![SUPPLIER_STATUS.ACTIVE].includes(supplier.status)) {
        throw BusinessException.error({
          message: 'msg.MSG_045',
          error: {
            supplier: supplier || null,
            SUPPLIER_STATUS: objectEnum(SUPPLIER_STATUS),
          },
        })
      }

      const pr = purchaseRequestMap[po.purchaseRequestCode]
      if (!pr || ![PurchaseRequestStatus.CONFIRM].includes(pr.status)) {
        throw BusinessException.error({
          message: 'msg.MSG_010',
          i18args: { obj: 'Đơn mua hàng' },
          error: {
            purchaseRequest: pr || null,
            PurchaseRequestStatus: objectEnum(PurchaseRequestStatus),
          },
        })
      }

      const incoterm = incotermMap[po.incotermId]
      if (!incoterm || !incoterm.isActive) {
        throw BusinessException.error({
          message: 'msg.MSG_195',
          i18args: { obj: 'Incoterms' },
          error: { incoterm: incoterm || null },
        })
      }

      const supplierItemList = supplier.supplierItems || []
      const supplierItemMap = arrayToKeyValue(supplierItemList, 'itemId')

      po.purchaseOrderItems.forEach((poItem) => {
        const item = itemMap[poItem.itemId]
        const supplierItem = supplierItemMap[poItem.itemId]

        if (
          !item ||
          ![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)
        ) {
          throw BusinessException.error({
            message: 'msg.MSG_195',
            i18args: { obj: 'Sản phẩm' },
            error: {
              item: item || null,
              ItemActiveStatusEnum: objectEnum(ItemActiveStatusEnum),
            },
          })
        }

        // TOD: Đơn vị tính thay đổi thì báo lỗi // Đơn vị tính của Item thay đổi khác với PO
        // if (poItem.itemUnitId !== supplierItem.itemUnitId) {
        //   throw BusinessException.error({
        //     message: 'msg.MSG_298',
        //     error: [{ purchaseRequestItem: poItem, supplierItem }],
        //   })
        // }

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
          throw BusinessException.error({
            message: 'msg.MSG_067',
            i18args: { obj: 'Sản phẩm' },
            error: {
              warehouse: warehouse || null,
              WarehouseStatusEnum: objectEnum(WarehouseStatusEnum),
            },
          })
        }
      })
    })
  }
}
