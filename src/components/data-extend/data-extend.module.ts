import { Module } from '@nestjs/common'
import { InformationService } from './information.service'
import { ValidateService } from './validate.service'

@Module({
  imports: [],
  controllers: [],
  providers: [InformationService, ValidateService],
  exports: [InformationService, ValidateService],
})
export class DataExtendModule {}
