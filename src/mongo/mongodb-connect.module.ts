import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
import { PoDeliveryItemRepository } from './po-delivery-item/po-delivery-item.repository'
import { PoDeliveryItemSchema } from './po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderHistoryRepository } from './purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderHistorySchema } from './purchase-order-history/purchase-order-history.schema'
import { PurchaseOrderItemRepository } from './purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderItemSchema } from './purchase-order-item/purchase-order-item.schema'
import { PurchaseOrderRepository } from './purchase-order/purchase-order.repository'
import { PurchaseOrderSchema } from './purchase-order/purchase-order.schema'
import { PurchaseRequestHistoryRepository } from './purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestHistorySchema } from './purchase-request-history/purchase-request-history.schema'
import { PurchaseRequestItemRepository } from './purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemSchema } from './purchase-request-item/purchase-request-item.schema'
import { PurchaseRequestRepository } from './purchase-request/purchase-request.repository'
import { PurchaseRequestSchema } from './purchase-request/purchase-request.schema'
import { UserActionRepository } from './user-action/user-action.repository'
import { UserActionSchema } from './user-action/user-action.schema'

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
      {
        name: 'PurchaseOrderSchema',
        schema: PurchaseOrderSchema,
      },
      {
        name: 'PurchaseOrderItemSchema',
        schema: PurchaseOrderItemSchema,
      },
      {
        name: 'PoDeliveryItemSchema',
        schema: PoDeliveryItemSchema,
      },
      {
        name: 'PurchaseOrderHistorySchema',
        schema: PurchaseOrderHistorySchema,
      },
      {
        name: 'UserActionSchema',
        schema: UserActionSchema,
      },
    ]),
  ],
  providers: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseOrderRepository,
    PurchaseRequestHistoryRepository,
    PurchaseOrderRepository,
    PurchaseOrderItemRepository,
    PoDeliveryItemRepository,
    PurchaseOrderHistoryRepository,
    UserActionRepository,
  ],
  exports: [
    PurchaseRequestRepository,
    PurchaseRequestItemRepository,
    PurchaseOrderRepository,
    PurchaseRequestHistoryRepository,
    PurchaseOrderRepository,
    PurchaseOrderItemRepository,
    PoDeliveryItemRepository,
    PurchaseOrderHistoryRepository,
    UserActionRepository,
  ],
})
export class MongoDbConnectModule {}
