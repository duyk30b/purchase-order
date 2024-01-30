import { Module } from '@nestjs/common'
import { ApiPurchaseOrderController } from './api-purchase-order.controller'
import { ApiPurchaseOrderService } from './api-purchase-order.service'
import { ApiPurchaseOrderCreateService } from './service/api-purchase-order-create.service'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderPaginationService } from './service/api-purchase-order-pagination.service'

@Module({
  imports: [],
  controllers: [ApiPurchaseOrderController],
  providers: [
    ApiPurchaseOrderService,
    ApiPurchaseOrderPaginationService,
    ApiPurchaseOrderDetailService,
    ApiPurchaseOrderCreateService,
  ],
})
export class ApiPurchaseOrderModule {}
