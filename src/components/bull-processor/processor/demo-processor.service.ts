import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { IPingQueueMessage } from '../../transporter/redis/bull-queue/bull-queue.interface'
import { QUEUE_EVENT } from '../../transporter/redis/bull-queue/bull-queue.variable'

@Processor(QUEUE_EVENT.DEMO)
export class DemoProcessor {
  private readonly logger = new Logger(DemoProcessor.name)

  @Process('demo-one')
  async demoOne({ data }: Job<IPingQueueMessage>) {}

  @Process('demo-two')
  async demoTwo({ data }: Job<IPingQueueMessage>) {
    throw new Error('has error occurred !!! ' + new Date().toISOString())
  }

  @OnQueueFailed()
  async handleFailed(job: Job<IPingQueueMessage>, err: Error) {
    const { messageId, data, createTime } = job.data
    this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
  }
}
