import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DemoCronJobService } from './demo/demo.job.service'
import { SyncDataSapModule } from './sync-data-sap/sync-data-sap.module'

@Module({
  imports: [ScheduleModule.forRoot(), SyncDataSapModule],
  providers: [DemoCronJobService],
  controllers: [],
})
export class CronJobModule {}
