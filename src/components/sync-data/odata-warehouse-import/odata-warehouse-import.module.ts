import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OdataWarehouseImportConfig } from './odata-warehouse-import.config'
import { OdataWarehouseImportService } from './odata-warehouse-import.service'

@Module({
  imports: [
    ConfigModule.forFeature(OdataWarehouseImportConfig),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [OdataWarehouseImportService],
  exports: [OdataWarehouseImportService],
})
export class OdataWarehouseImportModule {}
