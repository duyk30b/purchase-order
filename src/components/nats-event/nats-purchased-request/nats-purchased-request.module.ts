import { Module } from '@nestjs/common'
import { NatsPurchaseRequestController } from './nats-purchased-request.controller'
import { NatsPurchaseRequestService } from './nats-purchased-request.service'

@Module({
  imports: [],
  controllers: [NatsPurchaseRequestController],
  providers: [NatsPurchaseRequestService],
})
export class NatsPurchaseRequestModule {}
