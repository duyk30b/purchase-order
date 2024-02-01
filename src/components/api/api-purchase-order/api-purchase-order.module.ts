import { Module } from '@nestjs/common'
import { ApiPurchaseOrderController } from './api-purchase-order.controller'
import { ApiPurchaseOrderService } from './api-purchase-order.service'
import { ApiPurchaseOrderCancelService } from './service/api-purchase-order-cancel.service'
import { ApiPurchaseOrderConfirmService } from './service/api-purchase-order-confirm.service'
import { ApiPurchaseOrderCreateService } from './service/api-purchase-order-create.service'
import { ApiPurchaseOrderDeleteService } from './service/api-purchase-order-delete.service'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderListService } from './service/api-purchase-order-list.service'
import { ApiPurchaseOrderRejectService } from './service/api-purchase-order-reject.service'
import { ApiPurchaseOrderSuccessService } from './service/api-purchase-order-success.service'
import { ApiPurchaseOrderUpdateService } from './service/api-purchase-order-update.service'
import { ApiPurchaseOrderWaitConfirmService } from './service/api-purchase-order-wait-confirm.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseOrderController],
  providers: [
    ApiPurchaseOrderService,
    ApiPurchaseOrderListService,
    ApiPurchaseOrderDetailService,
    ApiPurchaseOrderCreateService,
    ApiPurchaseOrderUpdateService,
    ApiPurchaseOrderDeleteService,
    ApiPurchaseOrderWaitConfirmService,
    ApiPurchaseOrderRejectService,
    ApiPurchaseOrderConfirmService,
    ApiPurchaseOrderCancelService,
    ApiPurchaseOrderSuccessService,
  ],
})
export class ApiPurchaseOrderModule {}
