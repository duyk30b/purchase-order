import { Module } from '@nestjs/common'
import { BullQueueModule } from '../transporter/redis/bull-queue/bull-queue.module'
import { BullProcessorController } from './bull-processor.controller'
import { DemoProcessor } from './processor/demo-processor.service'
import { PingProcessor } from './processor/ping-processor.service'
import { RequestYn02Processor } from './processor/request-yn02.processor'

@Module({
  imports: [BullQueueModule.registerConsumer()],
  controllers: [BullProcessorController],
  providers: [PingProcessor, DemoProcessor, RequestYn02Processor],
})
export class BullProcessorModule {}
