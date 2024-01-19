import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Producer } from 'kafkajs'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaClientService.name)
  private kafkaProducer: Producer

  constructor(@Inject('KAFKA_CLIENT_SERVICE') private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    try {
      this.kafkaProducer = await this.kafkaClient.connect()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async onModuleDestroy() {
    await this.kafkaProducer.disconnect()
  }

  async emit(topicName: string, data: any) {
    const response = this.kafkaClient.emit(topicName, data)
    return await lastValueFrom(response)
  }

  async send(topicName: string, data: any) {
    return await this.kafkaProducer.send({
      topic: topicName,
      messages: [{ key: 'data', value: JSON.stringify(data) }],
      acks: -1,
    })
  }
}
