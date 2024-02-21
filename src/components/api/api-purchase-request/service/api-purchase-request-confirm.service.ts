import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryContent } from '../../../../mongo/purchase-request-history/purchase-request-history.constant'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestHistoryInsertType } from '../../../../mongo/purchase-request-history/purchase-request-history.schema'
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

@Injectable()
export class ApiPurchaseRequestConfirmService {
  private logger = new Logger(ApiPurchaseRequestConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  async confirm(options: {
    ids: string[]
    userId: number
  }): Promise<BaseResponse> {
    const { ids, userId } = options
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw BusinessException.error({
        message: 'error.FILTER_EMPTY',
        error: [{ ids }],
      })
    }
    const rootList = await this.purchaseRequestRepository.findMany({
      relation: { purchaseRequestItems: true },
      condition: { id: { IN: ids } },
    })
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    rootList.forEach((i) => {
      if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }
    })

    await this.validate(rootList)

    const idsObject = ids.map((id) => new Types.ObjectId(id))
    const prUpdateCount = await this.purchaseRequestRepository.updateMany(
      { _id: { IN: idsObject } },
      {
        status: PurchaseRequestStatus.CONFIRM,
        updatedByUserId: userId,
      }
    )

    // Lưu lịch sử
    const prHistoryDtoList = rootList.map((pr) => {
      const prHistoryDto: PurchaseRequestHistoryInsertType = {
        _purchase_request_id: new Types.ObjectId(pr.id),
        userId,
        status: { before: pr.status, after: PurchaseRequestStatus.CONFIRM },
        content: PurchaseRequestHistoryContent.CONFIRM,
        time: new Date(),
      }
      return prHistoryDto
    })

    await this.purchaseOrderHistoryRepository.insertManyFullField(
      prHistoryDtoList
    )

    return { data: { ids } }
  }

  async validate(purchaseRequestList: PurchaseRequestType[]) {
    const costCenterIds = purchaseRequestList.map((i) => i.costCenterId)
    const supplierIds = purchaseRequestList.map((i) => i.supplierId)
    const itemIdList = uniqueArray(
      purchaseRequestList
        .map((i) => i.purchaseRequestItems)
        .flat()
        .map((i) => i.itemId)
    )

    const dataExtendsPromise = await Promise.allSettled([
      costCenterIds && costCenterIds.length
        ? this.natsClientCostCenterService.getCostCenterMap({
            ids: costCenterIds,
          })
        : {},
      supplierIds && supplierIds.length
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: supplierIds } },
            relation: { supplierItems: true },
          })
        : {},
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
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
      Record<string, ItemType>,
    ]

    const [costCenterMap, supplierMap, itemMap] = dataExtendsResult

    purchaseRequestList.forEach((purchaseRequest) => {
      const costCenter = costCenterMap[purchaseRequest.costCenterId]
      const supplier = supplierMap[purchaseRequest.supplierId]

      if (
        !costCenter ||
        [
          CostCenterStatusEnum.DRAFT,
          CostCenterStatusEnum.DELETED,
          CostCenterStatusEnum.INACTIVE,
        ].includes(costCenter.status)
      ) {
        throw BusinessException.error({
          message: 'msg.MSG_195',
          i18args: { obj: 'Cost center / Bộ phận' },
          error: { costCenter: costCenter || null },
        })
      }

      if (!supplier || [SUPPLIER_STATUS.INACTIVE].includes(supplier.status)) {
        throw BusinessException.error({
          message: 'msg.MSG_045',
          error: { supplier: supplier || null },
        })
      }

      purchaseRequest.purchaseRequestItems.forEach((purchaseRequestItem) => {
        const item = itemMap[purchaseRequestItem.itemId]
        if ([ItemActiveStatusEnum.INACTIVE].includes(item.activeStatus)) {
          throw BusinessException.error({
            message: 'msg.MSG_195',
            i18args: { obj: 'Sản phẩm' },
            error: { item: item || null },
          })
        }

        const supplierItem = (supplier.supplierItems || []).find(
          (si) => purchaseRequestItem.itemId === si.itemId
        )

        if (
          !item ||
          !supplierItem ||
          ![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)
        ) {
          throw BusinessException.error({
            message: 'msg.MSG_195',
            i18args: { obj: 'Sản phẩm' },
            error: { item: item || null, supplierItem: supplierItem || null },
          })
        }

        // Đơn vị tính thay đổi thì báo lỗi
        if (purchaseRequestItem.itemUnitId !== supplierItem.itemUnitId) {
          throw BusinessException.error({
            message: 'msg.MSG_298',
            error: { purchaseRequestItem, supplierItem },
          })
        }
        // Thời hạn giao hàng thay đổi cũng báo lỗi
        if (purchaseRequestItem.deliveryTerm !== supplierItem.deliveryTerm) {
          throw BusinessException.error({
            message: 'msg.MSG_043',
            error: { purchaseRequestItem, supplierItem },
          })
        }
      })
    })
  }
}
