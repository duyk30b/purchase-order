import { Module } from '@nestjs/common'
import { NatsPurchaseOrderController } from './nats-purchased-order.controller'
import { NatsPurchaseOrderService } from './nats-purchased-order.service'

@Module({
  imports: [],
  controllers: [NatsPurchaseOrderController],
  providers: [NatsPurchaseOrderService],
})
export class NatsPurchaseOrderModule {}
