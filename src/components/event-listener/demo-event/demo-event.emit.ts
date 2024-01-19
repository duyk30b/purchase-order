import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DEMO_EVENT, DemoEventDataType } from './demo-event.constants'

@Injectable()
export class DemoEventEmit {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitRealtimeReport(payload: { data: DemoEventDataType }) {
    this.eventEmitter.emit(DEMO_EVENT.DEMO_EVENT_NAME, payload)
  }
}
