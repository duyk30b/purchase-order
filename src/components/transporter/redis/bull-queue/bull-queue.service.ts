import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { IPingQueueMessage, IRequestYn02Message } from './bull-queue.interface'
import { QUEUE_EVENT } from './bull-queue.variable'

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_EVENT.PING)
    private readonly pingQueue: Queue,
    @InjectQueue(QUEUE_EVENT.DEMO)
    private readonly demoQueue: Queue,
    @InjectQueue(QUEUE_EVENT.REQUEST_YN02)
    private readonly requestYn02Queue: Queue
  ) {}

  async addPingJob(data: IPingQueueMessage) {
    await this.pingQueue.add(data)
  }

  async addDemoJob(jobName: string, data: IPingQueueMessage) {
    await this.demoQueue.add(jobName, data)
  }

  async addRequestYn02Job(jobName: 'CREATE', data: IRequestYn02Message) {
    await this.requestYn02Queue.add(jobName, data)
  }
}
