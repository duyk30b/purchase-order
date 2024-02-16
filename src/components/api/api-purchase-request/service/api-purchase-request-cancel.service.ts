import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderStatus } from '../../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseRequestHistoryContent } from '../../../../mongo/purchase-request-history/purchase-request-history.constant'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestHistoryInsertType } from '../../../../mongo/purchase-request-history/purchase-request-history.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestStatus } from '../../../../mongo/purchase-request/purchase-request.schema'

@Injectable()
export class ApiPurchaseRequestCancelService {
  private logger = new Logger(ApiPurchaseRequestCancelService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository
  ) {}

  async cancel(options: {
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
    const rootList = await this.purchaseRequestRepository.findManyByIds(ids)
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    rootList.forEach((i) => {
      if (![PurchaseRequestStatus.CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010')
      }
    })

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const prCodeList = rootList.map((i) => i.code)

    // Check xem có PO không hợp lệ không
    const poList = await this.purchaseOrderRepository.findManyBy({
      purchaseRequestCode: { IN: prCodeList },
    })
    poList.forEach((i) => {
      if (
        ![
          PurchaseOrderStatus.WAIT_DELIVERY,
          PurchaseOrderStatus.DELIVERING,
          PurchaseOrderStatus.SUCCESS,
        ].includes(i.status)
      ) {
        throw new BusinessException('msg.MSG_010')
      }
    })

    const prUpdateCount = await this.purchaseRequestRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseRequestStatus.CONFIRM,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const prHistoryDtoList = rootList.map((pr) => {
      const prHistoryDto: PurchaseRequestHistoryInsertType = {
        _purchase_request_id: new Types.ObjectId(pr.id),
        userId,
        status: { before: pr.status, after: PurchaseRequestStatus.CONFIRM },
        content: PurchaseRequestHistoryContent.CANCEL,
        time: new Date(),
      }
      return prHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      prHistoryDtoList
    )

    return { data: { ids }, message: 'msg.MSG_011' }
  }
}
