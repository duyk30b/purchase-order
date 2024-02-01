import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import {
  PurchaseOrderStatus,
  PurchaseOrderType,
} from '../../../../mongo/purchase-order/purchase-order.schema'

@Injectable()
export class ApiPurchaseOrderRejectService {
  private logger = new Logger(ApiPurchaseOrderRejectService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository
  ) {}

  async reject(options: { id: string; userId: number }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseOrderRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseOrderStatus.WAIT_CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    // await Promise.all([
    //   this.validateService.validateCostCenter(rootData.costCenterId),
    //   this.validateService.validateVendor(rootData.vendorId),
    //   this.validateService.validateItem(
    //     rootData.purchaseOrderItems.map((i) => i.itemId)
    //   ),
    //   // TODO: validate đơn vị tính, thời hạn giao hàng có thay đổi không
    // ])

    const purchaseOrder: PurchaseOrderType =
      await this.purchaseOrderRepository.updateOne(
        { id },
        {
          status: PurchaseOrderStatus.REJECT,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseOrderHistoryRepository.insertOneFullField({
      _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
      userId,
      status: { before: rootData.status, after: purchaseOrder.status },
      content: 'Từ chối phiếu mua',
      time: new Date(),
    })
    return { data: purchaseOrder }
  }
}
