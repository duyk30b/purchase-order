import { Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { KafkaClientService } from './kafka-client.service'
import { KafkaSendReportService } from './kafka-send-report/kafka-send-report.service'
import { KafkaConfig } from './kafka.config'

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_CLIENT_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create(KafkaConfig)
      },
    },
    KafkaClientService,
    KafkaSendReportService,
  ],
  exports: [KafkaClientService, KafkaSendReportService],
})
export class KafkaClientModule {}
