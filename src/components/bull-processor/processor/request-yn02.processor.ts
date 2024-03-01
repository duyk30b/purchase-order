import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { NatsRequestService } from '../../transporter/nats/nats-request/nats-request.service'
import { IRequestYn02Message } from '../../transporter/redis/bull-queue/bull-queue.interface'
import { BullQueueService } from '../../transporter/redis/bull-queue/bull-queue.service'
import { QUEUE_EVENT } from '../../transporter/redis/bull-queue/bull-queue.variable'

@Processor(QUEUE_EVENT.REQUEST_YN02)
export class RequestYn02Processor {
  private readonly logger = new Logger(RequestYn02Processor.name)

  constructor(private readonly natsRequestService: NatsRequestService) {}

  @Process('CREATE')
  async handleProcess({ data }: Job<IRequestYn02Message>) {
    this.logger.log('START JOB CREATE YNO2')
    this.logger.log(JSON.stringify(data))
    const {} = await this.getInformation(data)

    await this.natsRequestService.createYn02({
      code: data.CCONF_ID,
      costCenterId: 'string',
      purchaseOrderId: 'string',
      vendorId: 'string',
      isApplyFee: true,
      description: '',
      details: [
        {
          warehouseId: 0,
          itemId: 0,
          itemTypeSettingId: 0,
          requestMainQuantity: 0,
          requestSubQuantity: 0,
          price: 0,
          currencyType: '',
          amount: 0,
          locatorId: '',
        },
      ],
    })
  }

  async getInformation(data: IRequestYn02Message) {
    return {}
  }

  @OnQueueFailed()
  async handleFailed(job: Job<any>, err: Error) {
    const { messageId, data, createTime } = job.data
    this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
  }
}
