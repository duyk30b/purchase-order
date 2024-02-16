import { Module } from '@nestjs/common'
import { ApiUserActionController } from './api-user-action.controller'
import { ApiUserActionService } from './api-user-action.service'

@Module({
  imports: [],
  controllers: [ApiUserActionController],
  providers: [ApiUserActionService],
})
export class ApiUserActionModule {}
