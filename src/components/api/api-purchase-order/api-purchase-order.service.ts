import { Injectable, Logger } from '@nestjs/common'
import { PurchaseOrderRepository } from '../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderGetManyQuery } from './request'

@Injectable()
export class ApiPurchaseOrderService {
  private logger = new Logger(ApiPurchaseOrderService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository
  ) {}

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

  async deleteOne(id: string) {
    const data = await this.purchaseOrderRepository.updateOne(
      { id },
      { deletedAt: new Date() }
    )
    return data
  }
}
