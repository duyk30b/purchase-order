import { Injectable, Logger } from '@nestjs/common'
import { uniqueArray } from '../../../../common/helpers'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderType } from '../../../../mongo/purchase-order/purchase-order.schema'
import { SupplierType } from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  NatsClientUserService,
  UserType,
} from '../../../transporter/nats/service/nats-client-user.service'
import { PurchaseOrderPaginationQuery } from '../request'

@Injectable()
export class ApiPurchaseOrderPaginationService {
  private logger = new Logger(ApiPurchaseOrderPaginationService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientUserService: NatsClientUserService
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
        ...(filter?.code ? { code: filter.code } : {}),
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

  async getDataExtends(data: PurchaseOrderType[]) {
    const supplierIdList = uniqueArray(data.map((i) => i.supplierId))
    const userCreateIdList = uniqueArray(data.map((i) => i.createdByUserId))

    const dataExtendsPromise = await Promise.allSettled([
      supplierIdList.length
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: supplierIdList } },
          })
        : {},
      userCreateIdList.length
        ? this.natsClientUserService.getUserMapByIds({
            userIds: userCreateIdList,
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
    }) as [Record<string, SupplierType>, Record<string, UserType>]

    return {
      supplierMap: dataExtendsResult[0],
      userRequestMap: dataExtendsResult[1],
    }
  }
}
