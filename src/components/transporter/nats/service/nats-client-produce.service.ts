import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type GetBomVersionsRequest = {
  ids?: number[]
}

export type BomVersionType = {
  id: number
  code?: string
}

@Injectable()
export class NatsClientProduceService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getBomVersions(request: GetBomVersionsRequest) {
    if (request.ids?.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.PRODUCE}.get_bom_versions_by_bom_version_ids`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as BomVersionType[]
  }
}
