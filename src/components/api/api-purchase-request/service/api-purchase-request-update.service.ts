import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemInsertType } from '../../../../mongo/purchase-request-item/purchase-request-item.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../../mongo/purchase-request/purchase-request.schema'
import { PurchaseRequestUpdateBody } from '../request'

@Injectable()
export class ApiPurchaseRequestUpdateService {
  private logger = new Logger(ApiPurchaseRequestUpdateService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository
  ) {}

  async updateOne(options: {
    id: string
    body: PurchaseRequestUpdateBody
    userId: number
  }): Promise<BaseResponse> {
    const { id, body, userId } = options
    const { items, ...purchaseRequestBody } = body

    // await Promise.all([
    //   this.validateService.validateCostCenter(body.costCenterId),
    //   this.validateService.validateVendor(body.vendorId),
    //   this.validateService.validateItem(body.items.map((i) => i.itemId)),
    // ])

    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseRequestStatus.DRAFT,
        PurchaseRequestStatus.WAIT_CONFIRM,
        PurchaseRequestStatus.REJECT,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    let status: PurchaseRequestStatus
    if (rootData.status === PurchaseRequestStatus.DRAFT) {
      status = PurchaseRequestStatus.DRAFT
    } else if (rootData.status === PurchaseRequestStatus.WAIT_CONFIRM) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    } else if (rootData.status === PurchaseRequestStatus.REJECT) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    }

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          ...purchaseRequestBody,
          status,
          userIdRequest: userId,
          updatedByUserId: userId,
        }
      )

    const deleteResult = await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(id) },
    })

    const itemsDto: PurchaseRequestItemInsertType[] = items.map((item) => {
      const dto: PurchaseRequestItemInsertType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItems =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Chỉnh sửa yêu cầu mua',
      time: new Date(),
    })

    return { data: purchaseRequest }
  }
}
