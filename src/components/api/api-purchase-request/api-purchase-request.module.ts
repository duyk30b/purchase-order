import { Module } from '@nestjs/common'
import { ApiPurchaseRequestController } from './api-purchase-request.controller'
import { ApiPurchaseRequestService } from './api-purchase-request.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseRequestController],
  providers: [ApiPurchaseRequestService],
})
export class ApiPurchaseRequestModule {}
