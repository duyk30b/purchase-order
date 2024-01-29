import { Injectable, Logger } from '@nestjs/common'
import { BaseResponse } from '../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseOrderGetManyRequest } from './request/purchase-order-get.query'

@Injectable()
export class NatsPurchaseOrderService {
  private logger = new Logger(NatsPurchaseOrderService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository
  ) {}

  async getMany(
    query: PurchaseOrderGetManyRequest
  ): Promise<BaseResponse<PurchaseOrderType[]>> {
    const { limit, filter, relation, sort } = query

    const data = await this.purchaseOrderRepository.findMany({
      relation,
      condition: {
        ...(filter?.searchText
          ? {
              //   $OR: [{ code: { LIKE: filter?.searchText } }, { name: { LIKE: filter?.searchText } }],
            }
          : { ...filter }),
      },
      limit,
      sort,
    })
    return { data }
  }
}
