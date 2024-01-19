import { Global, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DemoEventEmit } from './demo-event/demo-event.emit'
import { DemoEventListener } from './demo-event/demo-event.listener'

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [],
  providers: [DemoEventEmit, DemoEventListener],
  exports: [DemoEventEmit],
})
export class EventListenerModule {}
