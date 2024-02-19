import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { SoapItemGroupModule } from './soap-item-group/soap-item-group.module'
import { SyncDataSapController } from './sync-data-sap.controller'

@Module({
  imports: [
    // SoapItemGroupModule
  ],
  controllers: [SyncDataSapController],
  providers: [],
})
export class SyncDataSapModule {}
