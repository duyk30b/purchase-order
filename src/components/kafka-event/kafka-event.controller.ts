import { Controller } from '@nestjs/common'
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices'
import { KafkaTopic } from '../transporter/kafka/kafka.config'
import { KafkaEventService } from './kafka-event.service'

@Controller()
export class KafkaEventController {
  constructor(
    // private readonly kafkaClientService: KafkaClientService,
    private readonly kafkaEventService: KafkaEventService
  ) {}

  // @Get('kafka/ping')
  // async ping() {
  //   const response = await this.kafkaClientService.sendMessage(KafkaTopic.REPORT.PING, {
  //     data: {
  //       pingMessage: 'kafka/ping',
  //       pingTime: Date.now(),
  //     },
  //   })
  //   return response
  // }

  @MessagePattern(KafkaTopic.REPORT.PING, Transport.KAFKA)
  pong(@Payload() payload: any, @Ctx() context: KafkaContext) {
    return this.kafkaEventService.pong(payload)
  }
}
