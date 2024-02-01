import { Module } from '@nestjs/common'
import { ApiPurchaseRequestController } from './api-purchase-request.controller'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import { ApiPurchaseRequestCancelService } from './service/api-purchase-request-cancel.service'
import { ApiPurchaseRequestConfirmService } from './service/api-purchase-request-confirm.service'
import { ApiPurchaseRequestCreateService } from './service/api-purchase-request-create.service'
import { ApiPurchaseRequestDeleteService } from './service/api-purchase-request-delete.service'
import { ApiPurchaseRequestDetailService } from './service/api-purchase-request-detail.service'
import { ApiPurchaseRequestListService } from './service/api-purchase-request-list.service'
import { ApiPurchaseRequestRejectService } from './service/api-purchase-request-reject.service'
import { ApiPurchaseRequestUpdateService } from './service/api-purchase-request-update.service'
import { ApiPurchaseRequestWaitConfirmService } from './service/api-purchase-request-wait-confirm.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseRequestController],
  providers: [
    ApiPurchaseRequestService,
    ApiPurchaseRequestListService,
    ApiPurchaseRequestDetailService,
    ApiPurchaseRequestCreateService,
    ApiPurchaseRequestUpdateService,
    ApiPurchaseRequestDeleteService,
    ApiPurchaseRequestWaitConfirmService,
    ApiPurchaseRequestConfirmService,
    ApiPurchaseRequestRejectService,
    ApiPurchaseRequestCancelService,
  ],
})
export class ApiPurchaseRequestModule {}
