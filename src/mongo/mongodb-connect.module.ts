import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
import { PurchaseOrderRepository } from './purchase-order/purchase-order.repository'
import { PurchaseOrderSchema } from './purchase-order/purchase-order.schema'
import { PurchaseRequestHistoryRepository } from './purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestHistorySchema } from './purchase-request-history/purchase-request-history.schema'
import { PurchaseRequestItemRepository } from './purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemSchema } from './purchase-request-item/purchase-request-item.schema'
import { PurchaseRequestRepository } from './purchase-request/purchase-request.repository'
import { PurchaseRequestSchema } from './purchase-request/purchase-request.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongodbConfigService }),
    MongooseModule.forFeature([
      { name: 'PurchaseRequestSchema', schema: PurchaseRequestSchema },
      { name: 'PurchaseRequestItemSchema', schema: PurchaseRequestItemSchema },
      { name: 'PurchaseOrderSchema', schema: PurchaseOrderSchema },
      {
        name: 'PurchaseRequestHistorySchema',
        schema: PurchaseRequestHistorySchema,
      },
    ]),
  ],
  providers: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseOrderRepository,
    PurchaseRequestHistoryRepository,
  ],
  exports: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseOrderRepository,
    PurchaseRequestHistoryRepository,
  ],
})
export class MongoDbConnectModule {}
