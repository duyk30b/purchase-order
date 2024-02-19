import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { SyncDataController } from './sync-data.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // SoapItemGroupModule
  ],
  controllers: [SyncDataController],
  providers: [],
})
export class SyncDataModule {}
