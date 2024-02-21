import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestStatus } from '../../../../mongo/purchase-request/purchase-request.schema'

@Injectable()
export class ApiPurchaseRequestDeleteService {
  private logger = new Logger(ApiPurchaseRequestDeleteService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository
  ) {}

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
      throw new BusinessException('msg.MSG_010')
    }

    await this.purchaseRequestRepository.deleteOneBy({ id } as any)
    await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(id) },
    })
    return { data: id, message: 'msg.MSG_016' }
  }

  async deleteList(ids: string[]): Promise<BaseResponse> {
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
      if (
        ![
          PurchaseRequestStatus.DRAFT,
          PurchaseRequestStatus.WAIT_CONFIRM,
        ].includes(i.status)
      ) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }
    })

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    await this.purchaseRequestRepository.deleteManyBy({ id: { IN: ids } })
    await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: { IN: idsObject },
    })

    return {
      data: ids,
      message: 'msg.MSG_016',
      args: { obj: 'Yêu cầu mua hàng' },
    }
  }
}
