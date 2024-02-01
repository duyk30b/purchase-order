import { Injectable, Logger } from '@nestjs/common'
import { PurchaseOrderRepository } from '../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderGetManyQuery } from './request'

@Injectable()
export class ApiPurchaseOrderService {
  private logger = new Logger(ApiPurchaseOrderService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository
  ) {}

  async deleteOne(id: string) {
    const data = await this.purchaseOrderRepository.updateOne(
      { id },
      { deletedAt: new Date() }
    )
    return data
  }
}
