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
}
