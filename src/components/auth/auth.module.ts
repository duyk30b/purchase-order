import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
