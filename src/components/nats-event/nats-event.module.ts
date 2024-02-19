import { Module } from '@nestjs/common'
import { NatsEventController } from './nats-event.controller'
import { NatsEventService } from './nats-event.service'
import { NatsPurchaseOrderModule } from './nats-purchased-order/nats-purchased-order.module'
import { NatsPurchaseRequestModule } from './nats-purchased-request/nats-purchased-request.module'

@Module({
  imports: [NatsPurchaseOrderModule, NatsPurchaseRequestModule],
  controllers: [NatsEventController],
  providers: [NatsEventService],
})
export class NatsEventModule {}
