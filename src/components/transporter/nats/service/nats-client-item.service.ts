import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type ItemType = {
  id: number
  code?: string
  nameVn?: string
  nameJp?: string
  nameEn?: string
}

export type ItemTypeType = {
  id: number
  code?: string
  name?: string
}

export type ItemUnitType = {
  id: number
  code?: string
  name?: string
}

export type ItemPackingType = {
  id: number
  code?: string
  name?: string
}

@Injectable()
export class NatsClientItemService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getItemsByCodes(data: { codes: string[] }) {
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_by_codes`,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemType[]
  }

  async getItemsByIds(data: { itemIds: number[] }) {
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_items_by_ids`,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemType[]
  }

  async getItemTypesByIds(request: { ids: number[] }) {
    if (request.ids.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_type_by_ids`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemTypeType[]
  }

  async getItemTypesByCodes(request: { codes: string[] }) {
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_types_by_codes`,
      { codes: request.codes }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemTypeType[]
  }

  async getItemUnitsByIds(request: { ids: number[] }): Promise<any> {
    if (request.ids.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_unit_setting_by_ids`,
      { unitIds: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    const result: Record<string, ItemUnitType> = {}
    response.data.forEach((i: ItemUnitType) => (result[i.id] = i))
    return result
  }

  async getItemPackingsByIds(request: { ids: number[] }): Promise<any> {
    if (request.ids.length === 0) return {}
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_packings_by_ids`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    const result: Record<string, ItemPackingType> = {}
    response.data.forEach((i: ItemPackingType) => (result[i.id] = i))
    return result
  }
}