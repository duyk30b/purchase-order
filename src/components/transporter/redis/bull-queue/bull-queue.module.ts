import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import Bull from 'bull'
import { RedisConfig } from '../redis.config'
import { BullQueueService } from './bull-queue.service'
import { QUEUE_EVENT } from './bull-queue.variable'

const QUEUES: BullModuleOptions[] = [
  {
    name: QUEUE_EVENT.PING,
    defaultJobOptions: { attempts: 3, removeOnComplete: true },
  },
  {
    name: QUEUE_EVENT.DEMO,
    defaultJobOptions: { attempts: 3, removeOnComplete: true },
  },
  {
    name: QUEUE_EVENT.ITEM_STOCK_MOVEMENT,
    limiter: { max: 1, duration: 200, groupKey: 'groupKey' },
  },
]

@Module({})
export class BullQueueModule {
  static forRoot(): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule.forFeature(RedisConfig)],
          inject: [RedisConfig.KEY],
          useFactory: async (redisConfig: ConfigType<typeof RedisConfig>) => {
            const bullConfig: Bull.QueueOptions = {
              redis: {
                host: redisConfig.host,
                port: redisConfig.port,
                password: redisConfig.password,
                db: +redisConfig.db,
              },
              defaultJobOptions: { removeOnComplete: true },
              prefix: 'item-stock-planning',
            }
            return bullConfig
          },
        }),
      ],
    }
  }

  static registerProducer(): DynamicModule {
    const base = BullQueueModule.register()
    base.providers = [...(base.providers || []), BullQueueService]
    base.exports = [...(base.exports || []), BullQueueService]
    base.global = true
    return base
  }

  static registerConsumer(): DynamicModule {
    return BullQueueModule.register()
  }

  private static register(): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [BullModule.registerQueue(...QUEUES)],
    }
  }
}
