import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../../core/exception-filter/exception-filter'
import { PurchaseRequestRepository } from '../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'

@Injectable()
export class ApiPurchaseRequestService {
  private logger = new Logger(ApiPurchaseRequestService.name)

  constructor(private readonly purchaseRequestRepository: PurchaseRequestRepository) {}

  async pagination(query: PurchaseRequestPaginationQuery) {
    const { page, limit, filter, sort, relation } = query

    return await this.purchaseRequestRepository.pagination({
      page,
      limit,
      relation,
      condition: {
        code: filter.code,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      sort: sort || { _id: 'DESC' },
    })
  }

  async getMany(query: PurchaseRequestGetManyQuery) {
    const { limit, filter } = query

    return await this.purchaseRequestRepository.findMany({
      condition: {
        code: filter.code,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      limit,
    })
  }

  async getOne(id: string, query?: PurchaseRequestGetOneQuery) {
    const data = await this.purchaseRequestRepository.findOneBy({ id })
    if (!data) throw new BusinessException('error.NOT_FOUND')
    return data
  }

  async createOne(body: PurchaseRequestCreateBody, userId: number) {
    const data = await this.purchaseRequestRepository.insertOneFullField({
      ...body,
      userIdRequest: userId,
    })
    return data
  }

  async updateOne(id: string, body: PurchaseRequestUpdateBody) {
    const data = await this.purchaseRequestRepository.updateOne({ id }, body)
    return data
  }

  async deleteOne(id: string) {
    const data = await this.purchaseRequestRepository.updateOne({ id }, { deletedAt: new Date() })
    return data
  }
}
