import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseOrderHistoryContent } from '../../../../mongo/purchase-order-history/purchase-order-history.constant'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderHistoryInsertType } from '../../../../mongo/purchase-order-history/purchase-order-history.schema'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderStatus } from '../../../../mongo/purchase-order/purchase-order.schema'

@Injectable()
export class ApiPurchaseOrderWaitDeliveryService {
  private logger = new Logger(ApiPurchaseOrderWaitDeliveryService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository
  ) {}

  async waitDelivery(options: {
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
      if ([PurchaseOrderStatus.CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010')
      }
    })

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const poUpdateCount = await this.purchaseOrderRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseOrderStatus.WAIT_DELIVERY,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const poHistoryDtoList = rootList.map((po) => {
      const poHistoryDto: PurchaseOrderHistoryInsertType = {
        _purchase_order_id: new Types.ObjectId(po.id),
        userId,
        status: {
          before: po.status,
          after: PurchaseOrderStatus.WAIT_DELIVERY,
        },
        content: PurchaseOrderHistoryContent.WAIT_DELIVERY,
        time: new Date(),
      }
      return poHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      poHistoryDtoList
    )

    return { data: { ids }, message: 'msg.MSG_065' }
  }
}
