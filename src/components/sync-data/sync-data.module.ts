import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { OdataPurchaseOrderModule } from './odata-purchase-order/odata-purchase-order.module'
import { SyncDataController } from './sync-data.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // OdataPurchaseOrderModule,
    // SoapItemGroupModule
  ],
  controllers: [SyncDataController],
  providers: [],
})
export class SyncDataModule {}
