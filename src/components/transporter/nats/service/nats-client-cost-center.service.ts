import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type GetCostCentersRequest = {
  ids?: string[]
}

export type CostCenterType = {
  id: string
  code?: string
  eName?: string
  vName?: string
  jName?: string
}

@Injectable()
export class NatsClientCostCenterService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getCostCenters(request: GetCostCentersRequest) {
    if (request.ids?.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.COST_CENTER}.get_cost_center_by_conditions`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as CostCenterType[]
  }
}
