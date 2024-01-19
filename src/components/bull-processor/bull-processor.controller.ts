import { Controller, Get } from '@nestjs/common'
import { BullQueueService } from '../transporter/redis/bull-queue/bull-queue.service'

@Controller()
export class BullProcessorController {
  constructor(private readonly bullQueueService: BullQueueService) {}

  @Get('bull/ping')
  async ping() {
    const response = await this.bullQueueService.addPingJob({
      data: { message: 'ping' },
      messageId: 'ping_' + new Date().toISOString(),
      createTime: new Date().toISOString(),
    })
    return response
  }

  @Get('bull/demo')
  async demo() {
    const one = await this.bullQueueService.addDemoJob('demo-one', {
      data: { message: 'demo_one' },
      messageId: 'demo_one_' + new Date().toISOString(),
      createTime: new Date().toISOString(),
    })
    const two = await this.bullQueueService.addDemoJob('demo-two', {
      data: { message: 'demo_two' },
      messageId: 'demo_two_' + new Date().toISOString(),
      createTime: new Date().toISOString(),
    })
    return { one, two }
  }
}
