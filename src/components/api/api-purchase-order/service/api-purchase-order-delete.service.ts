import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderStatus } from '../../../../mongo/purchase-order/purchase-order.schema'

@Injectable()
export class ApiPurchaseOrderDeleteService {
  private logger = new Logger(ApiPurchaseOrderDeleteService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository
  ) {}

  async delete(ids: string[]): Promise<BaseResponse> {
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
      if (![PurchaseOrderStatus.DRAFT].includes(i.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Đơn mua hàng' })
      }
    })

    const deletePo = await this.purchaseOrderRepository.deleteManyBy({
      id: { IN: ids },
    })
    const poIdsObject = ids.map((id) => new Types.ObjectId(id))
    const deletePoItems = await this.purchaseOrderItemRepository.deleteManyBy({
      _purchase_order_id: { IN: poIdsObject },
    })
    const deletePoDeliveryItems =
      await this.poDeliveryItemRepository.deleteManyBy({
        _purchase_order_id: { IN: poIdsObject },
      })
    const deletePoHistory =
      await this.purchaseOrderHistoryRepository.deleteManyBy({
        _purchase_order_id: { IN: poIdsObject },
      })
    return { data: { ids }, message: 'msg.MSG_016' }
  }
}
