import { NatsConfig } from '@config/nats.config';
import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { NatsClientService } from './nats-client.service';
import { AuthService } from '@components/auth/auth.service';
import { UserService } from '@components/user/user.service';
import { UserCronService } from '@components/user/user.cron.service';

@Global()
@Module({
  providers: [
    {
      provide: 'NATS_CLIENT_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create(NatsConfig);
      },
    },
    NatsClientService,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    UserCronService,
  ],
  exports: [
    NatsClientService,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    UserCronService,
  ],
})
export class NatsClientModule {}
