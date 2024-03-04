import { Controller, Get } from '@nestjs/common'
import {
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
  Transport,
} from '@nestjs/microservices'
import { NatsClientService } from '../transporter/nats/nats-client.service'
import { NatsSubject } from '../transporter/nats/nats.config'
import { NatsEventService } from './nats-event.service'

@Controller()
export class NatsEventController {
  constructor(
    private readonly natsClientService: NatsClientService,
    private readonly natsEventService: NatsEventService
  ) {}

  @Get('nats/ping-report')
  async pingReport() {
    const response = await this.natsClientService.send(
      NatsSubject.REPORT.PING,
      {
        client: 'report-service',
        server: 'report-service',
        message: 'ping',
        time: Date.now(),
      }
    )
    return response
  }

  @Get('nats/ping-ticket')
  async pingTicket() {
    const response = await this.natsClientService.send(
      NatsSubject.TICKET.PING,
      {
        client: 'report-service',
        server: 'ticket-service',
        message: 'ping',
        time: Date.now(),
      }
    )
    return response
  }

  @Get('nats/ping-warehouse')
  async pingWarehouse() {
    const response = await this.natsClientService.send(
      NatsSubject.WAREHOUSE.PING,
      {
        client: 'report-service',
        server: 'warehouse-service',
        message: 'ping',
        time: Date.now(),
      }
    )
    return response
  }

  @MessagePattern(NatsSubject.PURCHASE_ORDER.PING, Transport.NATS)
  pong(@Payload() payload: any, @Ctx() context: NatsContext) {
    return this.natsEventService.pong(payload)
  }
}
