import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import {
  IItemStockMovementMessage,
  IPingQueueMessage,
} from './bull-queue.interface'
import { QUEUE_EVENT } from './bull-queue.variable'

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_EVENT.PING)
    private readonly pingQueue: Queue,
    @InjectQueue(QUEUE_EVENT.DEMO)
    private readonly demoQueue: Queue,
    @InjectQueue(QUEUE_EVENT.ITEM_STOCK_MOVEMENT)
    private readonly itemStockMovementCreateQueue: Queue
  ) {}

  async addPingJob(data: IPingQueueMessage) {
    await this.pingQueue.add(data)
  }

  async addDemoJob(jobName: string, data: IPingQueueMessage) {
    await this.demoQueue.add(jobName, data)
  }

  async addItemStockMovementCreateJob(
    jobName: 'CREATE',
    data: IItemStockMovementMessage
  ) {
    await this.itemStockMovementCreateQueue.add(jobName, data)
  }
}
