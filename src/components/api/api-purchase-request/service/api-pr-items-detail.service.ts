import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestType } from '../../../../mongo/purchase-request/purchase-request.schema'
import {
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'

@Injectable()
export class ApiPrItemDetailService {
  private logger = new Logger(ApiPrItemDetailService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  async itemsDetail(id: string): Promise<BaseResponse> {
    const purchaseRequest = await this.purchaseRequestRepository.findOne({
      relation: { purchaseRequestItems: true },
      condition: { id },
    })
    if (!purchaseRequest) {
      throw new BusinessException('error.NOT_FOUND')
    }

    const prItemIds = purchaseRequest.purchaseRequestItems.map((i) => i._id)

    const poDeliveryItem = await this.poDeliveryItemRepository.findManyBy({
      _purchase_order_item_id: { IN: prItemIds },
    })

    const meta = await this.getDataExtends(purchaseRequest)

    return { data: { purchaseRequest, poDeliveryItem, meta } }
  }

  async getDataExtends(data: PurchaseRequestType) {
    const purchaseRequestItems = data.purchaseRequestItems || []

    const itemIdList = uniqueArray([
      ...purchaseRequestItems.map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...purchaseRequestItems.map((i) => i.itemUnitId),
    ])

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
