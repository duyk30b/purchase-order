import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { RedisLockService } from './redis-lock.service'
import { RedisConfig } from './redis.config'

@Module({})
export class RedisClientModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: RedisClientModule,
      imports: [ConfigModule.forFeature(RedisConfig)],
      providers: [
        {
          provide: 'REDIS_CLIENT_SERVICE',
          inject: [RedisConfig.KEY],
          useFactory: (redisConfig: ConfigType<typeof RedisConfig>) => {
            return ClientProxyFactory.create({
              transport: Transport.REDIS,
              options: {
                port: redisConfig.port,
                host: redisConfig.host,
              },
            })
          },
        },
        RedisLockService,
      ],
      exports: [RedisLockService],
    }
  }
}
