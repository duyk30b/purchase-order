import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../../mongo/purchase-order/purchase-order.schema'
import { SupplierType } from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import {
  PurchaseOrderGetManyQuery,
  PurchaseOrderPaginationQuery,
} from '../request'

@Injectable()
export class ApiPurchaseOrderListService {
  private logger = new Logger(ApiPurchaseOrderListService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  async pagination(query: PurchaseOrderPaginationQuery): Promise<BaseResponse> {
    const { page, limit, filter, sort, relation } = query

    const { total, data } = await this.purchaseOrderRepository.pagination({
      relation,
      page,
      limit,
      condition: {
        ...(filter?.searchText
          ? {
              $OR: [
                { code: { LIKE: filter.searchText } },
                { purchaseRequestCode: { LIKE: filter.searchText } },
              ],
            }
          : {}),
        code: filter?.code,
        purchaseRequestCode: filter?.purchaseRequestCode,
        orderDate: filter?.orderDate,
        deliveryDate: filter?.deliveryDate,
        supplierId: filter?.supplierId,
        purchaseOrderKind: filter?.purchaseOrderKind,
        createdByUserId: filter?.createdByUserId,
        poPaymentStatus: filter?.poPaymentStatus,
        status: filter?.status,
      },
      sort: sort || { _id: 'DESC' },
    })

    const meta = await this.getDataExtends(data)

    return { data: { data, page, limit, total, meta } }
  }

  async getMany(query: PurchaseOrderGetManyQuery) {
    const { limit, filter, relation, sort } = query

    const data = await this.purchaseOrderRepository.findMany({
      relation,
      limit,
      condition: {
        ...(filter?.searchText
          ? {
              $OR: [
                { code: { LIKE: filter.searchText } },
                { purchaseRequestCode: { LIKE: filter.searchText } },
              ],
            }
          : {}),
        code: filter?.code,
        purchaseRequestCode: filter?.purchaseRequestCode,
        orderDate: filter?.orderDate,
        deliveryDate: filter?.deliveryDate,
        supplierId: filter?.supplierId,
        purchaseOrderKind: filter?.purchaseOrderKind,
        createdByUserId: filter?.createdByUserId,
        poPaymentStatus: filter?.poPaymentStatus,
        status: filter?.status,
      },
      sort: sort || { _id: 'DESC' },
    })

    const meta = await this.getDataExtends(data)

    return { data: { data, meta } }
  }

  async getDataExtends(data: PurchaseOrderType[]) {
    const supplierIdList = uniqueArray(data.map((i) => i.supplierId))
    const supplierMap = supplierIdList.length
      ? await this.natsClientVendorService.getSupplierMap({
          filter: { id: { IN: supplierIdList } },
          relation: { supplierItems: true },
        })
      : {}
    const supplierItemList = Object.values(supplierMap)
      .map((i) => i.supplierItems || [])
      .flat()

    const purchaseOrderItems = data
      .map((i) => i.purchaseOrderItems || [])
      .flat()
    const poDeliveryItems = data.map((i) => i.poDeliveryItems || []).flat()

    const itemIdList = uniqueArray([
      ...(supplierItemList || []).map((i) => i.itemId),
      ...(purchaseOrderItems || []).map((i) => i.itemId),
      ...(poDeliveryItems || []).map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(supplierItemList || []).map((i) => i.itemUnitId),
      ...(purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(poDeliveryItems || []).map((i) => i.itemUnitId),
    ])

    const userIdList = uniqueArray(data.map((i) => i.createdByUserId))

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
    ]

    const [userMap, itemMap, itemUnitMap] = dataExtendsResult

    return {
      supplierMap,
      userMap,
      itemMap,
      itemUnitMap,
    }
  }
}
