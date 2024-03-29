import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { OdataWarehouseImportModule } from './odata-warehouse-import/odata-warehouse-import.module'
import { SoapItemGroupModule } from './soap-item-group/soap-item-group.module'
import { SyncDataController } from './sync-data.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // OdataWarehouseImportModule,
    // SoapItemGroupModule,
  ],
  controllers: [SyncDataController],
  providers: [],
})
export class SyncDataModule {}
