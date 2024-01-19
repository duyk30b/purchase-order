import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DEMO_EVENT, DemoEventDataType } from './demo-event.constants'

@Injectable()
export class DemoEventListener {
  private logger = new Logger(DemoEventListener.name)

  @OnEvent(DEMO_EVENT.DEMO_EVENT_NAME)
  async processDemoEvent(payload: { data: DemoEventDataType }) {
    try {
      this.logger.log('DEMO_EVENT.DEMO_EVENT_NAME | ' + JSON.stringify(payload))
    } catch (error: any) {
      this.logger.error('[ERROR] DEMO_EVENT.DEMO_EVENT_NAME | ' + error.message)
    }
  }
}
