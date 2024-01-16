import { UserController } from '@components/user/user.controller';
import { ConfigService } from '@config/config.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserCronService } from './user.cron.service';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    UserCronService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    UserCronService,
  ],
  controllers: [UserController],
})
export class UserModule {}
