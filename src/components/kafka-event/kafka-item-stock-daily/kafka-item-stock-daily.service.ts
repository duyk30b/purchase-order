import { Injectable } from '@nestjs/common'
import { KafkaItemStockDailyRequest } from './kafka-item-stock-daily.request'

@Injectable()
export class KafkaItemStockDailyService {
  constructor() {}

  async snapShootItemStockDaily({ data }: KafkaItemStockDailyRequest) {
    console.log('🚀  ~ snapShootItemStockDaily ~ data:', data)
  }
}
