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

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly natsRequestService: NatsRequestService
  ) {}

  @Process('CREATE')
  async handleProcess({ data }: Job<IRequestYn02Message>) {
    this.logger.log('START JOB CREATE YNO2')
    this.logger.log(JSON.stringify(data))
  }

  @OnQueueFailed()
  async handleFailed(job: Job<any>, err: Error) {
    const { messageId, data, createTime } = job.data
    this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
  }
}
