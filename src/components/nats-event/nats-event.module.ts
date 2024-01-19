import { Module } from '@nestjs/common'
import { NatsEventController } from './nats-event.controller'
import { NatsEventService } from './nats-event.service'

@Module({
  imports: [],
  controllers: [NatsEventController],
  providers: [NatsEventService],
})
export class NatsEventModule {}
