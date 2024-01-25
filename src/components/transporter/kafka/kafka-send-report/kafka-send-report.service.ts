import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { objectEnum } from 'src/common/helpers'
import { KafkaClientService } from '../kafka-client.service'
import { KafkaTopic } from '../kafka.config'
import {
  ItemStockStatusEnum,
  KafkaItemStockDailyData,
  KafkaItemStockDailyRequest,
  WarehouseTypeEnum,
} from './kafka-item-stock-daily.request'

@Injectable()
export class KafkaSendReportService {
  constructor(private readonly kafkaClientService: KafkaClientService) {}

  async snapShotMidnightItemStockDaily(data: KafkaItemStockDailyData[]) {
    const message: KafkaItemStockDailyRequest = {
      meta: {
        ItemStockStatusEnum: objectEnum(ItemStockStatusEnum),
        WarehouseTypeEnum: objectEnum(WarehouseTypeEnum),
      },
      data,
    }

    const validate = validateSync(
      plainToInstance(KafkaItemStockDailyRequest, message, {
        excludeExtraneousValues: true, // exclude field not in class DTO => yes
        exposeUnsetFields: false, // expose field undefined in DTO => no
      }),
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
        validationError: { target: false, value: false },
      }
    )
    if (validate.length) {
      throw new Error(
        'KAFKA message validate failed: ' +
          JSON.stringify({ data: message, validate })
      )
    }

    await this.kafkaClientService.send(
      KafkaTopic.REPORT.SNAPSHOT_MIDNIGHT_ITEM_STOCK_DAILY,
      message
    )
  }
}
