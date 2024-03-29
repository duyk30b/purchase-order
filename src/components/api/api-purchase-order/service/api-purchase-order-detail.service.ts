import { Injectable, Logger } from '@nestjs/common'
import { keyBy } from 'lodash'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import { IncotermType } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.response'
import { NatsClientIncotermService } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CurrencyType,
  ItemType,
  ItemUnitType,
  ManufCountryType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import {
  NatsClientWarehouseService,
  WarehouseType,
} from '../../../transporter/nats/service/nats-client-warehouse.service'
import { PurchaseOrderGetOneByIdQuery } from '../request'

@Injectable()
export class ApiPurchaseOrderDetailService {
  private logger = new Logger(ApiPurchaseOrderDetailService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientIncotermService: NatsClientIncotermService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService
  ) {}

  async getOne(
    id: string,
    query?: PurchaseOrderGetOneByIdQuery
  ): Promise<BaseResponse> {
    const data = await this.purchaseOrderRepository.findOne({
      relation: query?.relation,
      condition: { id },
    })
    if (!data) throw new BusinessException('error.NOT_FOUND')

    const meta = await this.getDataExtends(data)
    return { data: { data, meta } }
  }

  async getDataExtends(data: PurchaseOrderType) {
    const supplierMap = data.supplierId
      ? await this.natsClientVendorService.getSupplierMap({
          filter: { id: { IN: [data.supplierId] } },
          relation: { supplierItems: true },
        })
      : {}

    const itemIdList = uniqueArray([
      ...(data.purchaseOrderItems || []).map((i) => i.itemId),
      ...(data.poDeliveryItems || []).map((i) => i.itemId),
      ...(supplierMap[data.supplierId]?.supplierItems || []).map(
        (i) => i.itemId
      ),
    ])
    const itemUnitIdList = uniqueArray([
      ...(data.purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(data.poDeliveryItems || []).map((i) => i.itemUnitId),
      ...(supplierMap[data.supplierId]?.supplierItems || []).map(
        (i) => i.itemUnitId
      ),
    ])
    const userIdList = uniqueArray([
      data.createdByUserId,
      ...(data.purchaseOrderHistories || []).map((i) => i.userId),
    ])

    const warehouseIdList = uniqueArray(
      (data.poDeliveryItems || []).map((i) => i.warehouseIdReceiving)
    )

    const purchasedRequest = data?.purchaseRequestId
      ? await this.purchaseRequestRepository.findOne({
          relation: { purchaseRequestItems: true },
          condition: { id: data?.purchaseRequestId },
        })
      : {}
    const purchasedRequestMap = keyBy([purchasedRequest], 'id')

    const dataExtendsPromise = await Promise.allSettled([
      userIdList.length
        ? this.natsClientUserService.getUserMapByIds({
            userIds: userIdList,
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
      warehouseIdList && warehouseIdList.length
        ? this.natsClientWarehouseService.getWarehouseMap({
            ids: warehouseIdList,
          })
        : {},
      data.currencyId
        ? this.natsClientItemService.getCurrencyMapByIds({
            ids: [data.currencyId],
          })
        : {},
      data.incotermId
        ? this.natsClientIncotermService.incotermGetMap({
            filter: { id: { IN: [data.incotermId] } },
          })
        : {},
      data.manufacturingCountryId
        ? this.natsClientItemService.getManufacturingCountryMapByIds({
            ids: [data.manufacturingCountryId],
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
      Record<string, WarehouseType>,
      Record<string, CurrencyType>,
      Record<string, IncotermType>,
      Record<string, ManufCountryType>,
    ]

    const [
      userMap,
      itemMap,
      itemUnitMap,
      warehouseMap,
      currencyMap,
      incotermMap,
      manufacturingCountryMap,
    ] = dataExtendsResult

    return {
      supplierMap,
      userMap,
      itemMap,
      itemUnitMap,
      warehouseMap,
      currencyMap,
      incotermMap,
      manufacturingCountryMap,
      purchasedRequestMap,
    }
  }
}
