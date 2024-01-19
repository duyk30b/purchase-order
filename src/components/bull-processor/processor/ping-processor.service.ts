import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { IPingQueueMessage } from '../../transporter/redis/bull-queue/bull-queue.interface'
import { BullQueueService } from '../../transporter/redis/bull-queue/bull-queue.service'
import { QUEUE_EVENT } from '../../transporter/redis/bull-queue/bull-queue.variable'

@Processor(QUEUE_EVENT.PING)
export class PingProcessor {
  private readonly logger = new Logger(PingProcessor.name)

  constructor(private readonly bullQueueService: BullQueueService) {}

  @Process()
  async handleProcess({ data }: Job<IPingQueueMessage>) {}

  @OnQueueFailed()
  async handleFailed(job: Job<IPingQueueMessage>, err: Error) {
    const { messageId, data, createTime } = job.data
    this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
  }
}
