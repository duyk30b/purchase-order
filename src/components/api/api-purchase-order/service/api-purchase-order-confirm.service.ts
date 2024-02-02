import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { uniqueArray } from '../../../../common/helpers'
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
  SupplierType,
} from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import { NatsClientCostCenterService } from '../../../transporter/nats/service/nats-client-cost-center.service'
import {
  ItemStatusEnum,
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'

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
    private readonly natsClientItemService: NatsClientItemService
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

    const rootList = await this.purchaseOrderRepository.findManyByIds(ids)
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    rootList.forEach((i) => {
      if ([PurchaseOrderStatus.WAIT_CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010')
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
    const supplierIds = purchaseOrderList.map((i) => i.supplierId)

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
      incotermIds && incotermIds.length
        ? this.natsClientIncotermService.incotermGetList({
            filter: { id: { IN: incotermIds } },
          })
        : {},
      purchaseRequestCodes && purchaseRequestCodes.length
        ? this.purchaseRequestRepository.findManyBy({
            code: { IN: purchaseRequestCodes },
          })
        : [],
      supplierIds && supplierIds.length
        ? this.natsClientVendorService.getSupplierList({
            filter: { id: { IN: supplierIds } },
            relation: { supplierItems: true },
          })
        : {},
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemListByIds({ itemIds: itemIdList })
        : {},
      itemUnitIdList && itemUnitIdList.length
        ? this.natsClientItemService.getItemUnitListByIds({
            unitIds: itemUnitIdList,
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
      IncotermType[],
      PurchaseRequestType[],
      SupplierType[],
      ItemType[],
      ItemUnitType[],
    ]

    const [
      incotermList,
      purchaseRequestList,
      supplierList,
      itemList,
      itemUnitList,
    ] = dataExtendsResult

    incotermList.forEach((i) => {
      if (!i.isActive) {
        throw new BusinessException('msg.MSG_052')
      }
    })
    purchaseRequestList.forEach((i) => {
      if (i.status !== PurchaseRequestStatus.CONFIRM) {
        throw new BusinessException('msg.MSG_010')
      }
    })
    supplierList.forEach((i) => {
      if (i.status === SUPPLIER_STATUS.INACTIVE) {
        throw new BusinessException('msg.MSG_045')
      }
    })
    itemList.forEach((i) => {
      if (i.status !== ItemStatusEnum.CONFIRMED) {
        throw new BusinessException('msg.MSG_195')
      }
    })
  }
}
