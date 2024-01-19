import { Module } from '@nestjs/common'
import { KafkaEventController } from './kafka-event.controller'
import { KafkaEventService } from './kafka-event.service'
import { KafkaItemStockDailyModule } from './kafka-item-stock-daily/kafka-item-stock-daily.module'

@Module({
  imports: [KafkaItemStockDailyModule],
  controllers: [KafkaEventController],
  providers: [KafkaEventService],
})
export class KafkaEventModule {}
