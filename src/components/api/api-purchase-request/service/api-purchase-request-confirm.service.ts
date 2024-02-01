import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
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

@Injectable()
export class ApiPurchaseRequestConfirmService {
  private logger = new Logger(ApiPurchaseRequestConfirmService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
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
    const rootList = await this.purchaseRequestRepository.findManyByIds(ids)
    if (!rootList.length) {
      throw new BusinessException('error.NOT_FOUND')
    }

    rootList.forEach((i) => {
      if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010')
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

    purchaseRequestList.forEach((purchaseRequest) => {
      const costCenter = costCenterMap[purchaseRequest.costCenterId]
      const supplier = supplierMap[purchaseRequest.supplierId]

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
    })
  }
}
