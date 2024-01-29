import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../../core/exception-filter/exception-filter'
import { PurchaseOrderRepository } from '../../../mongo/purchase-order/purchase-order.repository'
import {
  PurchaseOrderCreateBody,
  PurchaseOrderGetManyQuery,
  PurchaseOrderGetOneQuery,
  PurchaseOrderPaginationQuery,
  PurchaseOrderUpdateBody,
} from './request'

@Injectable()
export class ApiPurchaseOrderService {
  private logger = new Logger(ApiPurchaseOrderService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository
  ) {}

  async pagination(query: PurchaseOrderPaginationQuery) {
    const { page, limit, filter, sort, relation } = query

    // return await this.purchaseOrderRepository.pagination({
    //   page,
    //   limit,
    //   relation,
    //   condition: {
    //     $OR: filter.searchText
    //       ? [
    //           { description: { LIKE: filter.searchText } },
    //           { note: { LIKE: filter.searchText } },
    //         ]
    //       : undefined,
    //     updatedAt: filter?.updatedAt,
    //   },
    //   sort: sort || { _id: 'DESC' },
    // })
  }

  async getMany(query: PurchaseOrderGetManyQuery) {
    const { limit, filter } = query

    // return await this.purchaseOrderRepository.findMany({
    //   condition: {
    //     $OR: filter.searchText
    //       ? [
    //           { description: { LIKE: filter.searchText } },
    //           { note: { LIKE: filter.searchText } },
    //         ]
    //       : undefined,
    //     updatedAt: filter?.updatedAt,
    //   },
    //   limit,
    // })
  }

  async getOne(id: string, query?: PurchaseOrderGetOneQuery) {
    const data = await this.purchaseOrderRepository.findOneBy({ id })
    if (!data) throw new BusinessException('error.NOT_FOUND')
    return data
  }

  async createOne(body: PurchaseOrderCreateBody) {
    // const data = await this.purchaseOrderRepository.insertOne(body)
    // // const data = await this.purchaseOrderRepository.insertOneFullField(body)
    // return data
  }

  async updateOne(id: string, body: PurchaseOrderUpdateBody) {
    // const data = await this.purchaseOrderRepository.updateOne({ id }, body)
    // return data
  }

  async deleteOne(id: string) {
    const data = await this.purchaseOrderRepository.updateOne(
      { id },
      { deletedAt: new Date() }
    )
    return data
  }
}
