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
import { PurchaseRequestUpdateBody } from '../request'

@Injectable()
export class ApiPurchaseRequestUpdateService {
  private logger = new Logger(ApiPurchaseRequestUpdateService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async updateOne(options: {
    id: string
    body: PurchaseRequestUpdateBody
    userId: number
  }): Promise<BaseResponse> {
    const { id, body, userId } = options
    const { items, ...purchaseRequestBody } = body

    await this.validate(body)

    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.PurchaseRequest.NotFound')
    }
    if (
      ![
        PurchaseRequestStatus.DRAFT,
        PurchaseRequestStatus.WAIT_CONFIRM,
        PurchaseRequestStatus.REJECT,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
    }

    let status: PurchaseRequestStatus
    if (rootData.status === PurchaseRequestStatus.DRAFT) {
      status = PurchaseRequestStatus.DRAFT
    } else if (rootData.status === PurchaseRequestStatus.WAIT_CONFIRM) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    } else if (rootData.status === PurchaseRequestStatus.REJECT) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    }

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          ...purchaseRequestBody,
          status,
          userIdRequest: userId,
          updatedByUserId: userId,
        }
      )

    const deleteResult = await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: { EQUAL: new Types.ObjectId(id) },
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
      purchaseRequest.status === PurchaseRequestStatus.DRAFT
        ? PurchaseRequestHistoryContent.EDIT_DRAFT
        : PurchaseRequestHistoryContent.EDIT_WAIT_CONFIRM
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: historyContent,
      time: new Date(),
    })

    return { data: purchaseRequest }
  }

  async validate(data: PurchaseRequestUpdateBody) {
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
            filter: { id: { IN: [supplierId] } },
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

    itemList.forEach((item) => {
      if (![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)) {
        throw BusinessException.error({
          message: 'msg.MSG_195',
          i18args: { obj: 'Sản phẩm' },
          error: { item: item || null },
        })
      }
    })

    data.items.forEach((poItem) => {
      const supplierItem = supplier.supplierItems.find(
        (j) => j.itemId === poItem.itemId
      )

      if (!supplierItem || poItem.itemUnitId !== supplierItem.itemUnitId) {
        throw BusinessException.error({
          message: 'msg.MSG_298',
          error: { supplierItem, purchaseRequestItem: poItem },
        })
      }
      if (poItem.deliveryTerm !== supplierItem.deliveryTerm) {
        throw BusinessException.error({
          message: 'msg.MSG_043',
          error: { supplierItem, purchaseRequestItem: poItem },
        })
      }
    })
  }
}
