import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export enum WarehouseStatusEnum {
  Pending = 0,
  InActive = 1,
  Active = 2,
  Reject = 3,
}

export type GetWarehousesRequest = {
  id?: number
  ids?: number[]
  code?: string
  codes?: string[]
  status?: WarehouseStatusEnum
  statuses?: WarehouseStatusEnum[]
}

export type WarehouseType = {
  id: number
  name: string
  code: string
  status: WarehouseStatusEnum
}
@Injectable()
export class NatsClientWarehouseService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getWarehouseList(request: GetWarehousesRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.WAREHOUSE.GET_WAREHOUSES,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as WarehouseType[]
  }

  async getWarehouseMap(request: GetWarehousesRequest) {
    const warehouseList = await this.getWarehouseList(request)
    const warehouseMap: Record<string, WarehouseType> = {}
    warehouseList.forEach((i) => (warehouseMap[i.id] = i))
    return warehouseMap
  }
}
