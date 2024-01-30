import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PoDeliveryItemInsertType } from '../../../../mongo/po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-request-history.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderItemInsertType } from '../../../../mongo/purchase-order-item/purchase-order-item.schema'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import {
  PoPaymentStatus,
  PurchaseOrderStatus,
  PurchaseOrderType,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseOrderUpdateBody } from '../request'

@Injectable()
export class ApiPurchaseOrderUpdateService {
  private logger = new Logger(ApiPurchaseOrderUpdateService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository
  ) {}

  async update(options: {
    id: string
    body: PurchaseOrderUpdateBody
    userId: number
  }): Promise<BaseResponse> {
    const { id, body, userId } = options
    const { poItems, poDeliveryItems, ...purchaseOrderBody } = body

    // await Promise.all([
    //   this.validateService.validateCostCenter(body.costCenterId),
    //   this.validateService.validateVendor(body.vendorId),
    //   this.validateService.validateItem(body.items.map((i) => i.itemId)),
    // ])

    const rootData = await this.purchaseOrderRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.WAIT_CONFIRM,
        PurchaseOrderStatus.REJECT,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    let status: PurchaseOrderStatus
    if (rootData.status === PurchaseOrderStatus.DRAFT) {
      status = PurchaseOrderStatus.DRAFT
    } else if (rootData.status === PurchaseOrderStatus.WAIT_CONFIRM) {
      status = PurchaseOrderStatus.WAIT_CONFIRM
    } else if (rootData.status === PurchaseOrderStatus.REJECT) {
      status = PurchaseOrderStatus.WAIT_CONFIRM
    }

    const purchaseOrder: PurchaseOrderType =
      await this.purchaseOrderRepository.updateOne(
        { id },
        {
          ...purchaseOrderBody,
          status,
          updatedByUserId: userId,
          poPaymentStatus: PoPaymentStatus.UNPAID, // lưu tạm thế
          _total_money: new Types.Decimal128(body.totalMoney),
          _tax_money: new Types.Decimal128(body.taxMoney),
          _amount: new Types.Decimal128(body.amount),
          _delivery_expense: new Types.Decimal128(body.deliveryExpense),
          poPaymentPlans: body.poPaymentPlans.map((i) => {
            return {
              ...i,
              _amount: new Types.Decimal128(body.amount),
            }
          }),
        }
      )

    const deletePoItems = await this.purchaseOrderItemRepository.deleteManyBy({
      _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
    })
    const deletePoDeliveryItems =
      await this.poDeliveryItemRepository.deleteManyBy({
        _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
      })

    const itemsDto: PurchaseOrderItemInsertType[] = poItems.map((item) => {
      const dto: PurchaseOrderItemInsertType = {
        ...item,
        _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
        _price: new Types.Decimal128(item.price),
        _total_money: new Types.Decimal128(item.totalMoney),
        _amount: new Types.Decimal128(item.amount),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseOrder.purchaseOrderItems =
      await this.purchaseOrderItemRepository.insertManyFullField(itemsDto)

    const itemDeliveriesDto: PoDeliveryItemInsertType[] = poDeliveryItems.map(
      (item) => {
        const dto: PoDeliveryItemInsertType = {
          ...item,
          _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
          createdByUserId: userId,
          updatedByUserId: userId,
        }
        return dto
      }
    )

    purchaseOrder.poDeliveryItems =
      await this.poDeliveryItemRepository.insertManyFullField(itemDeliveriesDto)

    // Lưu lịch sử
    await this.purchaseOrderHistoryRepository.insertOneFullField({
      _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
      userId,
      status: { before: null, after: purchaseOrder.status },
      content: 'Chỉnh sửa phiếu mua',
      time: new Date(),
    })

    return { data: purchaseOrder }
  }
}
