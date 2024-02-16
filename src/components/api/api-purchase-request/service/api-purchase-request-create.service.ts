import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryContent } from '../../../../mongo/purchase-request-history/purchase-request-history.constant'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemInsertType } from '../../../../mongo/purchase-request-item/purchase-request-item.schema'
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../../mongo/purchase-request/purchase-request.schema'
import {
  SUPPLIER_STATUS,
  SupplierType,
} from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CostCenterStatusEnum,
  CostCenterType,
  NatsClientCostCenterService,
} from '../../../transporter/nats/service/nats-client-cost-center.service'
import {
  ItemActiveStatusEnum,
  ItemType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import { PurchaseRequestCreateBody } from '../request'

@Injectable()
export class ApiPurchaseRequestCreateService {
  private logger = new Logger(ApiPurchaseRequestCreateService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async createOne(options: {
    body: PurchaseRequestCreateBody
    userId: number
    status: PurchaseRequestStatus
  }): Promise<BaseResponse> {
    const { body, userId, status } = options
    const { items, ...purchaseRequestBody } = body

    await this.validate(body)

    const code = await this.purchaseRequestRepository.generateNextCode({})

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.insertOneFullField({
        ...purchaseRequestBody,
        code,
        status,
        userIdRequest: userId,
        createdByUserId: userId,
        updatedByUserId: userId,
      })

    const itemsDto: PurchaseRequestItemInsertType[] = items.map((item) => {
      const dto: PurchaseRequestItemInsertType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        _amount: new Types.Decimal128(item.amount),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItems =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    // Lưu lịch sử
    const historyContent =
      status === PurchaseRequestStatus.DRAFT
        ? PurchaseRequestHistoryContent.CREATE_DRAFT
        : PurchaseRequestHistoryContent.CREATE_WAIT_CONFIRM
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: null, after: purchaseRequest.status },
      content: historyContent,
      time: new Date(),
    })

    return { data: purchaseRequest, message: 'msg.MSG_012' }
  }

  async validate(data: PurchaseRequestCreateBody) {
    const { costCenterId, supplierId } = data
    const itemIdList = uniqueArray((data.items || []).map((i) => i.itemId))

    const dataExtendsPromise = await Promise.allSettled([
      costCenterId
        ? this.natsClientCostCenterService.getCostCenterMap({
            ids: [costCenterId],
          })
        : {},

      supplierId
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: [data.supplierId] } },
            relation: { supplierItems: true },
          })
        : {},
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemListByIds({ itemIds: itemIdList })
        : [],
    ])
    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return []
      }
    }) as [
      Record<string, CostCenterType>,
      Record<string, SupplierType>,
      ItemType[],
    ]

    const [costCenterMap, supplierMap, itemList] = dataExtendsResult
    const costCenter = costCenterMap[costCenterId]
    const supplier = supplierMap[supplierId]

    if (!costCenter) {
      throw new BusinessException('error.CostCenter.NotFound')
    }
    if (
      [
        CostCenterStatusEnum.DRAFT,
        CostCenterStatusEnum.DELETED,
        CostCenterStatusEnum.INACTIVE,
      ].includes(costCenter.status)
    ) {
      throw new BusinessException('msg.MSG_041')
    }

    if (!supplier) {
      throw new BusinessException('error.Supplier.NotFound')
    }
    if ([SUPPLIER_STATUS.INACTIVE].includes(supplier.status)) {
      throw new BusinessException('msg.MSG_045')
    }

    itemList.forEach((i) => {
      if ([ItemActiveStatusEnum.INACTIVE].includes(i.activeStatus)) {
        throw new BusinessException('msg.MSG_032')
      }
    })
  }
}
