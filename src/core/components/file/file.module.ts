import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import { FileService } from './file.service';
import { HttpClientModule } from '@core/components/http-client/http-client.module';

@Global()
@Module({
  imports: [HttpClientModule],
  exports: [
    ConfigService,
    {
      provide: 'FileServiceInterface',
      useClass: FileService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'FileServiceInterface',
      useClass: FileService,
    },
  ],
  controllers: [],
})
export class FileModule {}
