import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { BullQueueService } from '../../transporter/redis/bull-queue/bull-queue.service'
import { SAP_WAREHOUSE_IMPORT_INTERVAL } from './odata-warehouse-import.config'
import { OdataWarehouseImportService } from './odata-warehouse-import.service'

@Injectable()
export class OdataWarehouseImportJob {
  private readonly logger = new Logger(OdataWarehouseImportJob.name)

  constructor(
    private readonly odataWarehouseImportService: OdataWarehouseImportService,
    private readonly bullQueueService: BullQueueService
  ) {}

  @Interval(SAP_WAREHOUSE_IMPORT_INTERVAL)
  async start() {
    const top = 50
    let skip = 0
    let count = 0
    do {
      try {
        const { _count, results } =
          await this.odataWarehouseImportService.getData({ top, skip })

        count = Number(_count)
        skip = top + skip

        for (let i = 0; i < results.length; i++) {
          const result = results[i]
          await this.bullQueueService.addRequestYn02Job('CREATE', {
            groupKey: 'groupKey',
            ...result,
          })
        }
        this.logger.log('Send YN02 add to Queue Success !!!')
      } catch (err) {
        // Gửi email
        return
      }
    } while (skip < count)
  }
}
