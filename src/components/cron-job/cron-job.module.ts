import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DemoCronJobService } from './demo/demo.job.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [DemoCronJobService],
  controllers: [],
})
export class CronJobModule {}
