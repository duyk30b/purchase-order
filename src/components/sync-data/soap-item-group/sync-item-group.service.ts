import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { SAP_ITEM_GROUP_INTERVAL } from './soap-item-group.config'
import { SoapItemGroupService } from './soap-item-group.service'

@Injectable()
export class SyncItemGroupService {
  private readonly logger = new Logger(SyncItemGroupService.name)

  constructor(private readonly soapItemGroupService: SoapItemGroupService) {}

  @Interval(SAP_ITEM_GROUP_INTERVAL)
  async start() {
    const dataSoap = await this.soapItemGroupService.getAll()
  }
}
