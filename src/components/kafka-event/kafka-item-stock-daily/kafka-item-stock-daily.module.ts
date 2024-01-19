import { Module } from '@nestjs/common'
import { KafkaItemStockDailyController } from './kafka-item-stock-daily.controller'
import { KafkaItemStockDailyService } from './kafka-item-stock-daily.service'

@Module({
  imports: [],
  controllers: [KafkaItemStockDailyController],
  providers: [KafkaItemStockDailyService],
})
export class KafkaItemStockDailyModule {}
