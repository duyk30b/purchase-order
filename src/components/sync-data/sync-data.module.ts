import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { SoapPurchaseRequestModule } from './soap-purchase-request/soap-purchase-request.module'
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
