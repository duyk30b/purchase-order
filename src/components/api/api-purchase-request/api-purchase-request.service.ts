import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryRepository } from '../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestRepository } from '../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../mongo/purchase-request/purchase-request.schema'

@Injectable()
export class ApiPurchaseRequestService {
  private logger = new Logger(ApiPurchaseRequestService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository
  ) {}

  async success(id: string, userId: number): Promise<BaseResponse> {
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    // TODO: Check logic hoàn thành

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.SUCCESS,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: PurchaseRequestStatus.SUCCESS },
      content: 'Yêu cầu mua hoàn thành',
      time: new Date(),
    })
    return { data: id }
  }
}
