import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export enum CostCenterStatusEnum {
  DRAFT = 0,
  APPROVED = 1,
  INACTIVE = 2,
  ACTIVE = 3,
  DELETED = 4,
}

export type GetCostCentersRequest = {
  ids?: string[]
  codes?: string[]
  statuses?: number[]
}

export type CostCenterType = {
  id: string
  code?: string
  eName?: string
  vName?: string
  jName?: string
  status?: CostCenterStatusEnum
}

@Injectable()
export class NatsClientCostCenterService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getCostCenterList(request: GetCostCentersRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.COST_CENTER}.get_cost_center_by_conditions`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as CostCenterType[]
  }

  async getCostCenterMap(request: GetCostCentersRequest) {
    const costCenterList = await this.getCostCenterList(request)
    const costCenterMap: Record<string, CostCenterType> = {}
    costCenterList.forEach((i) => {
      costCenterMap[i.id] = i
    })
    return costCenterMap
  }
}
