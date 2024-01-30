import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../../mongo/purchase-order/purchase-order.schema'
import { SupplierType } from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CurrencyType,
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import { PurchaseOrderGetOneByIdQuery } from '../request'

@Injectable()
export class ApiPurchaseOrderDetailService {
  private logger = new Logger(ApiPurchaseOrderDetailService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientItemService: NatsClientItemService
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
    const itemIdList = uniqueArray([
      ...(data.purchaseOrderItems || []).map((i) => i.itemId),
      ...(data.poDeliveryItems || []).map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(data.purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(data.poDeliveryItems || []).map((i) => i.itemUnitId),
    ])
    const userIdList = uniqueArray([
      data.createdByUserId,
      ...(data.purchaseOrderHistories || []).map((i) => i.userId),
    ])

    const dataExtendsPromise = await Promise.allSettled([
      data.supplierId
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: [data.supplierId] } },
            relation: { supplierItems: true },
          })
        : {},
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
      data.currencyId
        ? this.natsClientItemService.getCurrencyMapByIds({
            ids: [data.currencyId],
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
      Record<string, ItemUnitType>,
      Record<string, CurrencyType>,
    ]
    return {
      supplierMap: dataExtendsResult[0],
      userMap: dataExtendsResult[1],
      itemMap: dataExtendsResult[2],
      itemUnitMap: dataExtendsResult[3],
      currencyMap: dataExtendsResult[4],
    }
  }
}
