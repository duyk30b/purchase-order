import { Module } from '@nestjs/common'
import { ApiPurchaseRequestModule } from './api-purchase-request/api-purchase-request.module'

@Module({
  imports: [ApiPurchaseRequestModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
