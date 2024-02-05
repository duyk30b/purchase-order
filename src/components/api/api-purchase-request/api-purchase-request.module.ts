import { Module } from '@nestjs/common'
import { ApiPurchaseRequestController } from './api-purchase-request.controller'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import { ApiPrItemDetailService } from './service/api-pr-items-detail.service'
import { ApiPurchaseRequestCancelService } from './service/api-purchase-request-cancel.service'
import { ApiPurchaseRequestConfirmService } from './service/api-purchase-request-confirm.service'
import { ApiPurchaseRequestCreateService } from './service/api-purchase-request-create.service'
import { ApiPurchaseRequestDeleteService } from './service/api-purchase-request-delete.service'
import { ApiPurchaseRequestGetService } from './service/api-purchase-request-get.service'
import { ApiPurchaseRequestRejectService } from './service/api-purchase-request-reject.service'
import { ApiPurchaseRequestUpdateService } from './service/api-purchase-request-update.service'
import { ApiPurchaseRequestWaitConfirmService } from './service/api-purchase-request-wait-confirm.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseRequestController],
  providers: [
    ApiPurchaseRequestService,
    ApiPurchaseRequestGetService,
    ApiPurchaseRequestCreateService,
    ApiPurchaseRequestUpdateService,
    ApiPurchaseRequestDeleteService,
    ApiPurchaseRequestWaitConfirmService,
    ApiPurchaseRequestConfirmService,
    ApiPurchaseRequestRejectService,
    ApiPurchaseRequestCancelService,
    ApiPrItemDetailService,
  ],
})
export class ApiPurchaseRequestModule {}
