import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OdataWarehouseImportJob } from './odata-warehouse-import/odata-warehouse-import.job'

@ApiTags('Sync Data')
@ApiBearerAuth('access-token')
@Controller('sync-data')
export class SyncDataController {
  constructor(
    private readonly odataWarehouseImportJob: OdataWarehouseImportJob
  ) {}

  @Get('odata-warehouse-import-job')
  async startWarehouseImportJob() {
    return await this.odataWarehouseImportJob.start()
  }
}
