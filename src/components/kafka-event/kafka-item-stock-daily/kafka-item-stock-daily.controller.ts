import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { KafkaTopic } from '../../transporter/kafka/kafka.config'
import { KafkaItemStockDailyRequest } from './kafka-item-stock-daily.request'
import { KafkaItemStockDailyService } from './kafka-item-stock-daily.service'

@Controller('kafka-item-stock-daily')
@ApiTags('Kafka ItemStockDaily')
@ApiBearerAuth('access-token')
export class KafkaItemStockDailyController {
  constructor(private readonly kafkaItemStockDailyService: KafkaItemStockDailyService) {}

  @MessagePattern(KafkaTopic.REPORT.SNAPSHOT_MIDNIGHT_ITEM_STOCK_DAILY, Transport.KAFKA)
  async snapShootItemStockDaily(@Payload() payload: KafkaItemStockDailyRequest) {
    return this.kafkaItemStockDailyService.snapShootItemStockDaily(payload)
  }
}
