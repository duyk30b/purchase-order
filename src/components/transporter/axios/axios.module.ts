import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfig } from '../../../config/global.config'
import { AxiosService } from './axios.service'
import { FileService } from './file.service'

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(GlobalConfig),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [AxiosService, FileService],
  exports: [AxiosService, FileService],
})
export class AxiosModule {}
