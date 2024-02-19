import { BootModule } from '@nestcloud/boot'
import { BOOT, CONSUL } from '@nestcloud/common'
import { ConsulModule } from '@nestcloud/consul'
import { ServiceModule } from '@nestcloud/service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import {
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { isDevMode } from './common/constants/variable'
import { ApiModule } from './components/api/api.module'
import { BullProcessorModule } from './components/bull-processor/bull-processor.module'
import { CronJobModule } from './components/cron-job/cron-job.module'
import { EventListenerModule } from './components/event-listener/event-listener.module'
import { KafkaEventModule } from './components/kafka-event/kafka-event.module'
import { NatsEventModule } from './components/nats-event/nats-event.module'
import { SyncDataModule } from './components/sync-data/sync-data.module'
import { AxiosModule } from './components/transporter/axios/axios.module'
import { KafkaClientModule } from './components/transporter/kafka/kafka-client.module'
import { NatsClientModule } from './components/transporter/nats/nats-client.module'
import { BullQueueModule } from './components/transporter/redis/bull-queue/bull-queue.module'
import { RedisClientModule } from './components/transporter/redis/redis.module'
import { AuthorizationGuard } from './core/guard/authorization.guard'
import { KongGatewayModule } from './core/kong-gateway/kong-gateway.module'
import { MongoDbConnectModule } from './mongo/mongodb-connect.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`, '.env'],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['lang', 'x-lang']),
      ],
      typesOutputPath: path.join(
        isDevMode() ? __dirname : process.cwd(),
        '../src/generated/i18n.generated.ts'
      ),
    }),

    BootModule.forRoot({ filePath: path.resolve(__dirname, '../config.yaml') }),
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    KongGatewayModule.forRootAsync(),

    MongoDbConnectModule,

    NatsClientModule,
    NatsEventModule,

    // KafkaClientModule,
    // KafkaEventModule,

    // BullQueueModule.forRoot(),
    // BullQueueModule.registerProducer(),
    // BullProcessorModule,
    // RedisClientModule,

    // EventListenerModule,
    // CronJobModule,
    SyncDataModule,
    AxiosModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    AppService,
  ],
})
export class AppModule {}
