import { Module } from '@nestjs/common'
import { ApiPurchaseOrderController } from './api-purchase-order.controller'
import { ApiPurchaseOrderService } from './api-purchase-order.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseOrderController],
  providers: [ApiPurchaseOrderService],
})
export class ApiPurchaseOrderModule {}
