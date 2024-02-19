import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Sync Data')
@ApiBearerAuth('access-token')
@Controller('sync-data')
export class SyncDataController {
  // constructor(private readonly syncItemGroupService: SyncItemGroupService) {}

  @Get('sync-item-group')
  async syncItemGroup() {
    // return await this.syncItemGroupService.start()
  }
}
