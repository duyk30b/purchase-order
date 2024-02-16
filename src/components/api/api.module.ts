import { Module } from '@nestjs/common'
import { ApiPurchaseOrderModule } from './api-purchase-order/api-purchase-order.module'
import { ApiPurchaseRequestModule } from './api-purchase-request/api-purchase-request.module'
import { ApiUserActionModule } from './api-user-action/api-user-action.module'

@Module({
  imports: [
    ApiPurchaseRequestModule,
    ApiPurchaseOrderModule,
    ApiUserActionModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
