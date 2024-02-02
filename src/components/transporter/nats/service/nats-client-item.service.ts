import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export enum ItemStatusEnum {
  DRAFT,
  WAITING_CONFIRM,
  CONFIRMED,
  REJECTED,
}

export enum ItemActiveStatusEnum {
  INACTIVE = 0,
  ACTIVE = 1,
}

export type ItemType = {
  id: number
  code?: string
  nameVn?: string
  nameJp?: string
  nameEn?: string
  itemCostCenters?: any[]
  country: any
  status: ItemStatusEnum
  activeStatus: ItemActiveStatusEnum
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

export type CurrencyType = {
  id: number
  code?: string
  name?: string
}

export type ManufCountryType = {
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

  async getItemListByIds(request: { itemIds: number[] }) {
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_items_by_ids`,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemType[]
  }

  async getItemMapByIds(request: { itemIds: number[] }) {
    const itemList = await this.getItemListByIds(request)
    const itemMap: Record<string, ItemType> = {}
    itemList.forEach((i) => (itemMap[i.id] = i))
    return itemMap
  }

  async getItemTypesByIds(request: { ids: number[] }) {
    if (request.ids.length === 0) return []
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_type_by_ids`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemTypeType[]
  }

  async getItemTypeMapByIds(request: { ids: number[] }) {
    const itemTypeList = await this.getItemTypesByIds(request)
    const itemTypeMap: Record<string, ItemTypeType> = {}
    itemTypeList.forEach((i) => (itemTypeMap[i.id] = i))
    return itemTypeMap
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

  async getItemUnitListByIds(request: { unitIds: number[] }) {
    if (request.unitIds.length === 0) return []
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_item_unit_setting_by_ids`,
      { unitIds: request.unitIds }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ItemUnitType[]
  }

  async getItemUnitMapByIds(request: { unitIds: number[] }) {
    const itemUnitList = await this.getItemUnitListByIds(request)
    const itemUnitMap: Record<string, ItemUnitType> = {}
    itemUnitList.forEach((i) => (itemUnitMap[i.id] = i))
    return itemUnitMap
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

  async getCurrencyListByIds(request: { ids: number[] }) {
    if (request.ids.length === 0) return []
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_currency_units_by_ids`,
      { ids: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as CurrencyType[]
  }

  async getCurrencyMapByIds(request: { ids: number[] }) {
    const currencyList = await this.getCurrencyListByIds(request)
    const currencyMap: Record<string, CurrencyType> = {}
    currencyList.forEach((i) => (currencyMap[i.id] = i))
    return currencyMap
  }

  async getManufCountryListByIds(request: { ids: number[] }) {
    if (request.ids.length === 0) return []
    const response: NatsResponseInterface = await this.natsClient.send(
      `${NatsService.ITEM}.get_manufacturing_country_by_ids`,
      { manufacturingCountryIds: request.ids }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as ManufCountryType[]
  }

  async getManufacturingCountryMapByIds(request: { ids: number[] }) {
    const manufCountryList = await this.getManufCountryListByIds(request)
    const manufCountryMap: Record<string, ManufCountryType> = {}
    manufCountryList.forEach((i) => (manufCountryMap[i.id] = i))
    return manufCountryMap
  }
}
