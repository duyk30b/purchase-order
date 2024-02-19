import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SyncItemGroupService } from './soap-item-group/sync-item-group.service'

@ApiTags('Sync Data SAP')
@ApiBearerAuth('access-token')
@Controller('sync-data-sap')
export class SyncDataSapController {
  constructor(private readonly syncItemGroupService: SyncItemGroupService) {}

  @Get('sync-item-group')
  async syncItemGroup() {
    return await this.syncItemGroupService.start()
  }
}
