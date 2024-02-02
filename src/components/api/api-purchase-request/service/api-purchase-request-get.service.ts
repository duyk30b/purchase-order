import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestType } from '../../../../mongo/purchase-request/purchase-request.schema'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CostCenterType,
  NatsClientCostCenterService,
} from '../../../transporter/nats/service/nats-client-cost-center.service'
import {
  CurrencyType,
  ItemType,
  ItemTypeType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import {
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneByIdQuery,
  PurchaseRequestPaginationQuery,
} from '../request'

@Injectable()
export class ApiPurchaseRequestGetService {
  private logger = new Logger(ApiPurchaseRequestGetService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async pagination(
    query: PurchaseRequestPaginationQuery
  ): Promise<BaseResponse> {
    const { page, limit, filter, sort, relation } = query

    const { total, data } = await this.purchaseRequestRepository.pagination({
      page,
      limit,
      relation,
      condition: {
        ...(filter?.searchText ? { code: { LIKE: filter.searchText } } : {}),
        ...(filter?.code ? { code: filter.code } : {}),
        requestDate: filter?.requestDate,
        receiveDate: filter?.receiveDate,
        costCenterId: filter?.costCenterId,
        sourceAddress: filter?.sourceAddress,
        supplierId: filter?.supplierId,
        status: filter?.status,
      },
      sort: sort || { _id: 'DESC' },
    })

    const meta = await this.getDataExtends(data)

    return { data: { data, page, limit, total, meta } }
  }

  async getMany(query: PurchaseRequestGetManyQuery): Promise<BaseResponse> {
    const { limit, filter, relation } = query

    const data = await this.purchaseRequestRepository.findMany({
      relation,
      condition: {
        ...(filter?.searchText ? { code: { LIKE: filter.searchText } } : {}),
        ...(filter?.code ? { code: filter.code } : {}),
        requestDate: filter?.requestDate,
        receiveDate: filter?.receiveDate,
        costCenterId: filter?.costCenterId,
        sourceAddress: filter?.sourceAddress,
        supplierId: filter?.supplierId,
        status: filter?.status,
      },
      limit,
    })
    const meta = await this.getDataExtends(data)
    return { data: { data, meta } }
  }

  async getOne(
    id: string,
    query?: PurchaseRequestGetOneByIdQuery
  ): Promise<BaseResponse> {
    const data = await this.purchaseRequestRepository.findOne({
      relation: query?.relation,
      condition: { id },
    })
    if (!data) throw new BusinessException('error.NOT_FOUND')

    const meta = await this.getDataExtends([data])
    return { data: { data, meta } }
  }

  async getDataExtends(data: PurchaseRequestType[]) {
    const supplierIdList = uniqueArray(data.map((i) => i.supplierId))
    const supplierMap = await this.natsClientVendorService.getSupplierMap({
      filter: { id: { IN: supplierIdList } },
      relation: { supplierItems: true },
    })
    const supplierItemList = Object.values(supplierMap)
      .map((i) => i.supplierItems || [])
      .flat()

    const purchaseRequestItems = data
      .map((i) => i.purchaseRequestItems || [])
      .flat()

    const userRequestIdList = uniqueArray(data.map((i) => i.userIdRequest))
    const itemIdList = uniqueArray([
      ...(supplierItemList || []).map((i) => i.itemId),
      ...purchaseRequestItems.map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(supplierItemList || []).map((i) => i.itemUnitId),
      ...purchaseRequestItems.map((i) => i.itemUnitId),
    ])
    const itemTypeIdList = uniqueArray([
      ...purchaseRequestItems.map((i) => i.itemTypeId),
    ])
    const costCenterIdList = uniqueArray(data.map((i) => i.costCenterId))
    const currencyIdList = uniqueArray(data.map((i) => i.currencyId))

    const dataExtendsPromise = await Promise.allSettled([
      userRequestIdList.length
        ? this.natsClientUserService.getUserMapByIds({
            userIds: userRequestIdList,
          })
        : {},
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
        : {},
      itemUnitIdList && itemUnitIdList.length
        ? this.natsClientItemService.getItemUnitMapByIds({
            unitIds: itemUnitIdList,
          })
        : {},
      itemTypeIdList && itemTypeIdList.length
        ? this.natsClientItemService.getItemTypeMapByIds({
            ids: itemTypeIdList,
          })
        : {},
      costCenterIdList.length
        ? this.natsClientCostCenterService.getCostCenterMap({
            ids: costCenterIdList,
          })
        : {},

      currencyIdList.length
        ? this.natsClientItemService.getCurrencyMapByIds({
            ids: currencyIdList,
          })
        : {},
    ])

    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return {}
      }
    }) as [
      Record<string, UserType>,
      Record<string, ItemType>,
      Record<string, ItemUnitType>,
      Record<string, ItemTypeType>,
      Record<string, CostCenterType>,
      Record<string, CurrencyType>,
    ]

    const [
      userMap,
      itemMap,
      itemUnitMap,
      itemTypeMap,
      costCenterMap,
      currencyMap,
    ] = dataExtendsResult

    return {
      supplierMap,
      userMap,
      itemMap,
      itemUnitMap,
      itemTypeMap,
      costCenterMap,
      currencyMap,
    }
  }
}
