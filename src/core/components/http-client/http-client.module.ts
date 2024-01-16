import { HttpClientService } from './http-client.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@config/config.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    HttpClientService,
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {}
