import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryRepository } from '../../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../../mongo/purchase-request-item/purchase-request-item.repository'
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
import { NatsClientItemService } from '../../../transporter/nats/service/nats-client-item.service'

@Injectable()
export class ApiPurchaseRequestWaitConfirmService {
  private logger = new Logger(ApiPurchaseRequestWaitConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async waitConfirm(options: {
    id: string
    userId: number
  }): Promise<BaseResponse> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.PurchaseRequest.NotFound')
    }
    if (![PurchaseRequestStatus.DRAFT].includes(rootData.status)) {
      throw new BusinessException('msg.MSG_010')
    }

    // await Promise.all([
    //   this.validateService.validateCostCenter(rootData.costCenterId),
    //   this.validateService.validateVendor(rootData.vendorId),
    //   this.validateService.validateItem(
    //     rootData.purchaseRequestItems.map((i) => i.itemId)
    //   ),
    //   // TODO: validate đơn vị tính, thời hạn giao hàng có thay đổi không
    // ])

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
      content: 'Đề nghị duyệt yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async validate(data: PurchaseRequestType) {
    const { costCenterId, supplierId } = data
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
  }
}
