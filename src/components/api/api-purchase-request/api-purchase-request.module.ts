import { Module } from '@nestjs/common'
import { DataExtendModule } from '../../data-extend/data-extend.module'
import { ApiPurchaseRequestController } from './api-purchase-request.controller'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import { ApiPurchaseRequestDetailService } from './service/api-purchase-request-detail.service'
import { ApiPurchaseRequestPaginationService } from './service/api-purchase-request-pagination.service'

@Module({
  imports: [DataExtendModule],
  controllers: [ApiPurchaseRequestController],
  providers: [
    ApiPurchaseRequestService,
    ApiPurchaseRequestDetailService,
    ApiPurchaseRequestPaginationService,
  ],
})
export class ApiPurchaseRequestModule {}
