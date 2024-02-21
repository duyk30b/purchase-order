import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryContent } from '../../../../mongo/purchase-request-history/purchase-request-history.constant'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
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
export class ApiPurchaseRequestWaitConfirmService {
  private logger = new Logger(ApiPurchaseRequestWaitConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  async waitConfirm(options: {
    id: string
    userId: number
  }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOne({
      relation: { purchaseRequestItems: true },
      condition: { id },
    })
    if (!rootData) {
      throw new BusinessException('error.PurchaseRequest.NotFound')
    }
    if (![PurchaseRequestStatus.DRAFT].includes(rootData.status)) {
      throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
    }

    await this.validate(rootData)

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.WAIT_CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: PurchaseRequestHistoryContent.WAIT_CONFIRM,
      time: new Date(),
    })
    return {
      data: purchaseRequest,
      message: 'msg.MSG_255',
      args: { obj: 'Yêu cầu mua hàng' },
    }
  }

  async validate(purchaseRequest: PurchaseRequestType) {
    const { costCenterId, supplierId } = purchaseRequest
    const itemIdList = uniqueArray(
      (purchaseRequest.purchaseRequestItems || []).map((i) => i.itemId)
    )

    const dataExtendsPromise = await Promise.allSettled([
      costCenterId
        ? this.natsClientCostCenterService.getCostCenterMap({
            ids: [costCenterId],
          })
        : {},
      supplierId
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: [supplierId] } },
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
      throw new BusinessException('msg.MSG_195', {
        obj: 'Cost center',
      })
    }

    if (!supplier) {
      throw new BusinessException('error.Supplier.NotFound')
    }
    if ([SUPPLIER_STATUS.INACTIVE].includes(supplier.status)) {
      throw new BusinessException('msg.MSG_045')
    }

    purchaseRequest.purchaseRequestItems.forEach((poItem) => {
      const item = itemMap[poItem.itemId]
      if ([ItemActiveStatusEnum.INACTIVE].includes(item.activeStatus)) {
        throw BusinessException.error({
          message: 'msg.MSG_195',
          i18args: { obj: 'Sản phẩm' },
          error: { item: item || null },
        })
      }

      const supplierItem = (supplier.supplierItems || []).find(
        (si) => poItem.itemId === si.itemId
      )
      if (!supplierItem) {
        throw new BusinessException('error.SupplierItem.NotFound')
      }
      // Đơn vị tính thay đổi thì báo lỗi
      if (poItem.itemUnitId !== supplierItem.itemUnitId) {
        throw BusinessException.error({
          message: 'msg.MSG_298',
          error: [{ purchaseRequestItem: poItem, supplierItem }],
        })
      }
      // Thời hạn giao hàng thay đổi cũng báo lỗi
      if (poItem.deliveryTerm !== supplierItem.deliveryTerm) {
        throw BusinessException.error({
          message: 'msg.MSG_043',
          error: [{ poItem, supplierItem }],
        })
      }
    })
  }
}
