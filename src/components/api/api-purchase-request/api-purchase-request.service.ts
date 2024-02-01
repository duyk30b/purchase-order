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

  async confirm(options: {
    id: string
    userId: number
  }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }
    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Xác nhận yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async reject(options: { id: string; userId: number }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }
    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.REJECT,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Từ chối yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async cancel(options: { id: string; userId: number }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    // TODO
    // Check có PO đang ở trạng thái đã đặt hàng, đang giao hàng, hoàn thành không ?? => NẾu có thì lỗi

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.CANCEL,
          updatedByUserId: userId,
        }
      )
    return { data: purchaseRequest }
  }

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
          status: PurchaseRequestStatus.CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Yêu cầu mua hoàn thành',
      time: new Date(),
    })
    return { data: id }
  }

  async deleteOne(id: string): Promise<BaseResponse> {
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseRequestStatus.DRAFT,
        PurchaseRequestStatus.WAIT_CONFIRM,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    await this.purchaseRequestRepository.deleteOneBy({ id } as any)
    await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(id) },
    })
    return { data: id }
  }

  async history(id: string): Promise<BaseResponse> {
    const data = await this.purchaseRequestHistoryRepository.findManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(id) },
    })

    // GET thêm dataUser

    return { data: data }
  }
}
