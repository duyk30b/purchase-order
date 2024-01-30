import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PoDeliveryItemInsertType } from '../../../../mongo/po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderItemInsertType } from '../../../../mongo/purchase-order-item/purchase-order-item.schema'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import {
  PoPaymentStatus,
  PurchaseOrderStatus,
  PurchaseOrderType,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import { PurchaseOrderCreateBody } from '../request'

@Injectable()
export class ApiPurchaseOrderCreateService {
  private logger = new Logger(ApiPurchaseOrderCreateService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository
  ) {}

  async createOne(options: {
    body: PurchaseOrderCreateBody
    userId: number
    status: PurchaseOrderStatus
  }): Promise<BaseResponse> {
    const { body, userId, status } = options
    const { poItems, poDeliveryItems, ...purchaseOrderBody } = body

    // await Promise.all([
    //   this.validateService.validateCostCenter(body.costCenterId),
    //   this.validateService.validateVendor(body.vendorId),
    //   this.validateService.validateItem(body.items.map((i) => i.itemId)),
    // ])

    const code = await this.purchaseOrderRepository.generateNextCode({})

    const purchaseOrder: PurchaseOrderType =
      await this.purchaseOrderRepository.insertOneFullField({
        ...purchaseOrderBody,
        code,
        status,
        createdByUserId: userId,
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
      content: 'Tạo mới thành công',
      time: new Date(),
    })

    return { data: purchaseOrder }
  }
}
