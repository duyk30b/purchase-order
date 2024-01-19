import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type GetLocatorsRequest = {
  warehouseId?: number
  ids?: string[]
}

export type LocatorType = {
  id: string
  pathCode?: string
  pathName?: string
  name?: string
  level?: number
  mpath?: string
}

@Injectable()
export class NatsClientWarehouseLayoutService {
  private readonly logger = new Logger(NatsClientWarehouseLayoutService.name)

  constructor(private readonly natsClient: NatsClientService) {}

  async getLocatorsBy(data: GetLocatorsRequest): Promise<any[]> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.WAREHOUSE_LAYOUT.GET_LOCATORS,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as LocatorType[]
  }

  public async getLocatorByCodes(request: { codes: string[] }) {
    const response = await this.natsClient.send(
      `${NatsService.WAREHOUSE_LAYOUT}.get_locator_by_codes`,
      request
    )
    if (response.statusCode !== 200) {
      this.logger.error(JSON.stringify(response))
    }
    return response.data as LocatorType[]
  }
}
