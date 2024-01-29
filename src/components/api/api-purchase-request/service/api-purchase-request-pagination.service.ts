import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { PurchaseRequestType } from '../../../../mongo/purchase-request/purchase-request.schema'
import { SupplierType } from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CostCenterType,
  NatsClientCostCenterService,
} from '../../../transporter/nats/service/nats-client-cost-center.service'
import {
  CurrencyType,
  ItemType,
  ItemTypeType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import { PurchaseRequestPaginationQuery } from '../request'

@Injectable()
export class ApiPurchaseRequestPaginationService {
  private logger = new Logger(ApiPurchaseRequestPaginationService.name)

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

  async getDataExtends(data: PurchaseRequestType[]) {
    const purchaseRequestItems = data.map((i) => i.purchaseRequestItems).flat()

    const supplierIdList = uniqueArray(data.map((i) => i.supplierId))
    const userRequestIdList = uniqueArray(data.map((i) => i.userIdRequest))
    const itemIdList = uniqueArray(purchaseRequestItems.map((i) => i.itemId))
    const itemTypeIdList = uniqueArray(
      purchaseRequestItems.map((i) => i.itemTypeId)
    )
    const costCenterIdList = uniqueArray(data.map((i) => i.costCenterId))
    const currencyIdList = uniqueArray(data.map((i) => i.currencyId))

    const dataExtendsPromise = await Promise.allSettled([
      supplierIdList.length
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: supplierIdList } },
          })
        : {},
      userRequestIdList.length
        ? this.natsClientUserService.getUserMapByIds({
            userIds: userRequestIdList,
          })
        : {},
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
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
      Record<string, SupplierType>,
      Record<string, UserType>,
      Record<string, ItemType>,
      Record<string, ItemTypeType>,
      Record<string, CostCenterType>,
      Record<string, CurrencyType>,
    ]

    return {
      supplierMap: dataExtendsResult[0],
      userRequestMap: dataExtendsResult[1],
      itemMap: dataExtendsResult[2],
      itemTypeMap: dataExtendsResult[3],
      costCenterMap: dataExtendsResult[4],
      currencyMap: dataExtendsResult[5],
    }
  }
}
