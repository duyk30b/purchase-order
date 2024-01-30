import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../../mongo/purchase-order/purchase-order.schema'
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
import { PurchaseOrderGetOneByIdQuery } from '../request'

@Injectable()
export class ApiPurchaseOrderDetailService {
  private logger = new Logger(ApiPurchaseOrderDetailService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
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
    // const itemIdList = uniqueArray(
    //   (data.purchaseOrderItems || []).map((i) => i.itemId)
    // )
    // const itemUnitIdList = uniqueArray(
    //   (data.purchaseOrderItems || []).map((i) => i.itemUnitId)
    // )
    // const dataExtendsPromise = await Promise.allSettled([
    //   data.supplierId
    //     ? this.natsClientVendorService.getSupplierMap({
    //         filter: { id: { IN: [data.supplierId] } },
    //       })
    //     : {},
    //   data.currencyId
    //     ? this.natsClientItemService.getCurrencyMapByIds({
    //         ids: [data.currencyId],
    //       })
    //     : {},
    //   data.createdByUserId
    //     ? this.natsClientUserService.getUserMapByIds({
    //         userIds: [data.createdByUserId],
    //       })
    //     : {},
    //   itemIdList && itemIdList.length
    //     ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
    //     : {},
    //   itemTypeIdList && itemTypeIdList.length
    //     ? this.natsClientItemService.getItemTypeMapByIds({
    //         ids: itemTypeIdList,
    //       })
    //     : {},
    //   data.costCenterId
    //     ? this.natsClientCostCenterService.getCostCenterMap({
    //         ids: [data.costCenterId],
    //       })
    //     : {},
    // ])
    // const dataExtendsResult = dataExtendsPromise.map((i, index) => {
    //   if (i.status === 'fulfilled') {
    //     return i.value
    //   } else {
    //     this.logger.error('Get info from Nats failed: ' + index)
    //     this.logger.error(i)
    //     return {}
    //   }
    // }) as [
    //   Record<string, SupplierType>,
    //   Record<string, UserType>,
    //   Record<string, ItemType>,
    //   Record<string, ItemTypeType>,
    //   Record<string, CostCenterType>,
    //   Record<string, CurrencyType>,
    // ]
    // return {
    //   supplierMap: dataExtendsResult[0],
    //   userOrderMap: dataExtendsResult[1],
    //   itemMap: dataExtendsResult[2],
    //   itemTypeMap: dataExtendsResult[3],
    //   costCenterMap: dataExtendsResult[4],
    //   currencyMap: dataExtendsResult[5],
    // }
  }
}
