import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import {
  arrayToKeyValue,
  convertViToEn,
  customFilter,
  uniqueArray,
} from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PoDeliveryItemType } from '../../../../mongo/po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import {
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'

@Injectable()
export class ApiPurchaseRequestItemExchangeService {
  private logger = new Logger(ApiPurchaseRequestItemExchangeService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  async itemsExchange(options: {
    purchaseRequestId: string
    searchText: string
  }): Promise<BaseResponse> {
    const { purchaseRequestId, searchText } = options

    const purchaseRequest =
      await this.purchaseRequestRepository.findOneById(purchaseRequestId)
    if (!purchaseRequest) {
      throw new BusinessException('error.NOT_FOUND')
    }
    const purchaseOrderList = await this.purchaseOrderRepository.findManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(purchaseRequestId) },
    })
    if (!purchaseOrderList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    const purchaseOrderMap = arrayToKeyValue(purchaseOrderList, 'id')
    const purchaseOrderIdList = purchaseOrderList.map((i) => i._id)

    let poDeliveryItemList = await this.poDeliveryItemRepository.findManyBy({
      _purchase_order_id: { IN: purchaseOrderIdList },
    })

    const meta = {
      purchaseRequest,
      purchaseOrderMap,
      ...(await this.getDataExtends(poDeliveryItemList)),
    }

    if (searchText) {
      poDeliveryItemList = poDeliveryItemList.filter((i) => {
        const purchaseOrder = purchaseOrderMap[i.purchaseOrderId]
        const item = meta.itemMap[i.itemId]
        return (
          customFilter(purchaseOrder.code, searchText) ||
          customFilter(item.code, searchText) ||
          customFilter(item.nameEn, searchText)
        )
      })
    }

    return { data: { data: poDeliveryItemList, meta } }
  }

  async getDataExtends(data: PoDeliveryItemType[]) {
    const itemIdList = uniqueArray((data || []).map((i) => i.itemId))
    const itemUnitIdList = uniqueArray((data || []).map((i) => i.itemUnitId))

    const dataExtendsPromise = await Promise.allSettled([
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
        : {},
      itemUnitIdList && itemUnitIdList.length
        ? this.natsClientItemService.getItemUnitMapByIds({
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
        return {}
      }
    }) as [Record<string, ItemType>, Record<string, ItemUnitType>]

    const [itemMap, itemUnitMap] = dataExtendsResult

    return {
      itemMap,
      itemUnitMap,
    }
  }
}
