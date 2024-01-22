import { Module } from '@nestjs/common'
import { DataExtendModule } from '../../data-extend/data-extend.module'
import { ApiPurchaseRequestController } from './api-purchase-request.controller'
import { ApiPurchaseRequestService } from './api-purchase-request.service'

@Module({
  imports: [DataExtendModule],
  controllers: [ApiPurchaseRequestController],
  providers: [ApiPurchaseRequestService],
})
export class ApiPurchaseRequestModule {}
