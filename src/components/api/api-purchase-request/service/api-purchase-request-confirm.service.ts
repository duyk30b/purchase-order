import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'

@Injectable()
export class ApiPurchaseRequestConfirmService {
  private logger = new Logger(ApiPurchaseRequestConfirmService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseRequestRepository,
    private readonly purchaseOrderItemRepository: PurchaseRequestItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository
  ) {}

  // async confirm(options: {
  //   ids: string[]
  //   userId: number
  // }): Promise<BaseResponse> {
  //   const { ids, userId } = options
  //   const rootDataList = await this.purchaseOrderRepository.findManyByIds(ids)
  //   if (!rootDataList.length || rootDataList.length !== ids.length) {
  //     throw new BusinessException('error.NOT_FOUND')
  //   }
  //   // if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(rootData.status)) {
  //   //   throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
  //   // }

  //   // await Promise.all([
  //   //   this.validateService.validateCostCenter(rootData.costCenterId),
  //   //   this.validateService.validateVendor(rootData.vendorId),
  //   //   this.validateService.validateItem(
  //   //     rootData.purchaseOrderItems.map((i) => i.itemId)
  //   //   ),
  //   //   // TODO: validate đơn vị tính, thời hạn giao hàng có thay đổi không
  //   // ])

  //   // const purchaseOrder: PurchaseRequestType =
  //   //   await this.purchaseOrderRepository.updateOne(
  //   //     { id },
  //   //     {
  //   //       status: PurchaseRequestStatus.CONFIRM,
  //   //       updatedByUserId: userId,
  //   //     }
  //   //   )

  //   // // Lưu lịch sử
  //   // await this.purchaseOrderHistoryRepository.insertOneFullField({
  //   //   _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
  //   //   userId,
  //   //   status: { before: rootData.status, after: purchaseOrder.status },
  //   //   content: 'Xác nhận phiếu mua',
  //   //   time: new Date(),
  //   // })
  //   // return { data: purchaseOrder }
  // }
}
