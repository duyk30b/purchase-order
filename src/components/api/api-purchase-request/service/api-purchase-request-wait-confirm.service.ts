import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
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

@Injectable()
export class ApiPurchaseRequestWaitConfirmService {
  private logger = new Logger(ApiPurchaseRequestWaitConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
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
      throw new BusinessException('msg.MSG_010')
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
    return { data: purchaseRequest, message: 'msg.MSG_044' }
  }

  async validate(purchaseRequest: PurchaseRequestType) {
    const { costCenterId, supplierId } = purchaseRequest
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
    ])
    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return []
      }
    }) as [Record<string, CostCenterType>, Record<string, SupplierType>]

    const [costCenterMap, supplierMap] = dataExtendsResult
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

    purchaseRequest.purchaseRequestItems.forEach((purchaseRequestItem) => {
      const supplierItem = (supplier.supplierItems || []).find((si) => {
        purchaseRequestItem.id === si.id
      })
      if (!supplierItem) {
        throw new BusinessException('error.SupplierItem.NotFound')
      }
      // Đơn vị tính thay đổi thì báo lỗi
      if (purchaseRequestItem.itemUnitId !== supplierItem.itemUnitId) {
        throw BusinessException.error({
          message: 'msg.MSG_035',
          error: [{ purchaseRequestItem, supplierItem }],
        })
      }
      // Thời hạn giao hàng thay đổi cũng báo lỗi
      if (purchaseRequestItem.deliveryTerm !== supplierItem.deliveryTerm) {
        throw BusinessException.error({
          message: 'msg.MSG_035',
          error: [{ purchaseRequestItem, supplierItem }],
        })
      }
    })
  }
}
