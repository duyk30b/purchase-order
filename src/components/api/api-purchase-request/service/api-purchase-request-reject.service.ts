import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryContent } from '../../../../mongo/purchase-request-history/purchase-request-history.constant'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestHistoryInsertType } from '../../../../mongo/purchase-request-history/purchase-request-history.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestStatus } from '../../../../mongo/purchase-request/purchase-request.schema'

@Injectable()
export class ApiPurchaseRequestRejectService {
  private logger = new Logger(ApiPurchaseRequestRejectService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository
  ) {}

  async reject(options: {
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
      if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }
    })

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const prUpdateCount = await this.purchaseRequestRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseRequestStatus.REJECT,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const prHistoryDtoList = rootList.map((pr) => {
      const prHistoryDto: PurchaseRequestHistoryInsertType = {
        _purchase_request_id: new Types.ObjectId(pr.id),
        userId,
        status: { before: pr.status, after: PurchaseRequestStatus.REJECT },
        content: PurchaseRequestHistoryContent.REJECT,
        time: new Date(),
      }
      return prHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      prHistoryDtoList
    )

    return {
      data: { ids },
      message: 'msg.MSG_189',
      args: { obj: 'Yêu cầu mua hàng' },
    }
  }
}
