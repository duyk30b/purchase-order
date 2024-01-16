import { HttpClientModule } from '@core/components/http-client/http-client.module';
import { KongGatewayModule } from '@core/components/kong-gateway/kong-gateway.module';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { ValidationPipe } from '@core/pipe/validator.pipe';
import { NatsClientModule } from '@components/nats-transporter/nats-client.module';
import { BootModule } from '@nestcloud/boot';
import { BOOT, CONSUL } from '@nestcloud/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryResolver } from './i18n/query-resolver';
import { FileModule } from '@components/file/file.module';
import { MongoConnectModule } from '@components/mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    BootModule.forRoot({
      filePath: path.resolve(__dirname, '../config.yaml'),
    }),
    EventEmitterModule.forRoot(),
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    HttpClientModule,
    KongGatewayModule.forRootAsync(),
    FileModule,
    NatsClientModule,
    MongoConnectModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    AppService,
  ],
})
export class AppModule {}
