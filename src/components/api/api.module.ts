import { Module } from '@nestjs/common'
import { ApiPurchaseOrderModule } from './api-purchase-order/api-purchase-order.module'
import { ApiPurchaseRequestModule } from './api-purchase-request/api-purchase-request.module'

@Module({
  imports: [ApiPurchaseRequestModule, ApiPurchaseOrderModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
