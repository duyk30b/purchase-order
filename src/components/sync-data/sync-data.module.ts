import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { OdataWarehouseImportModule } from './odata-warehouse-import/odata-warehouse-import.module'
import { SyncDataController } from './sync-data.controller'

@Module({
  imports: [ScheduleModule.forRoot(), OdataWarehouseImportModule],
  controllers: [SyncDataController],
  providers: [],
})
export class SyncDataModule {}
