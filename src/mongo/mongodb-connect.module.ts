import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
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
      {
        name: 'PurchaseRequestHistorySchema',
        schema: PurchaseRequestHistorySchema,
      },
    ]),
  ],
  providers: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseRequestHistoryRepository,
  ],
  exports: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseRequestHistoryRepository,
  ],
})
export class MongoDbConnectModule {}
