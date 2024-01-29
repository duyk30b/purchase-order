import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseOrder } from '../purchase-order/purchase-order.schema'

@Schema({ collection: 'purchaseOrderItem', timestamps: true })
export class PurchaseOrderItem extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_order_id: Types.ObjectId

  @Prop()
  prIndexLine: number

  @Prop()
  itemId: number

  @Prop()
  itemUnitId: number // Đơn vị tính => trường này phải lấy theo nhà cung cấp

  @Prop()
  deliveryTerm: Date // thời hạn giao hàng => trường này phải lấy theo nhà cung cấp

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _price: Types.Decimal128 // Đơn giá

  @Prop()
  quantityPrimary: number

  @Prop()
  quantitySecondary: number

  @Prop()
  discount: number

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _total_money: Types.Decimal128 // Tổng tiền (giá mua x số lượng x chiết khấu)

  @Prop()
  tax: number // thuế suất

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _amount: Types.Decimal128 // Thành tiền (total x tax)
}

const PurchaseOrderItemSchema = SchemaFactory.createForClass(PurchaseOrderItem)
PurchaseOrderItemSchema.index({ _purchase_order_id: 1 }, { unique: false })
PurchaseOrderItemSchema.index({ itemId: 1 }, { unique: false })

PurchaseOrderItemSchema.virtual('purchaseOrder', {
  ref: 'PurchaseOrderSchema',
  localField: '_purchase_order_id',
  foreignField: '_id',
  justOne: true,
})
PurchaseOrderItemSchema.virtual('purchaseOrderId').get(function () {
  return this._purchase_order_id.toHexString()
})

PurchaseOrderItemSchema.virtual('price').get(function () {
  return this._price.toString()
})
PurchaseOrderItemSchema.virtual('totalMoney').get(function () {
  return this._total_money.toString()
})
PurchaseOrderItemSchema.virtual('amount').get(function () {
  return this._amount.toString()
})

export { PurchaseOrderItemSchema }

export type PurchaseOrderItemType = Omit<
  PurchaseOrderItem,
  keyof Document<PurchaseOrderItem>
> & {
  id?: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
  price?: string
  totalMoney?: string
  amount?: string
}

export type PurchaseOrderItemInsertType = Omit<
  PurchaseOrderItemType,
  'id' | '_id' | 'purchaseOrderId' | 'purchaseOrder'
>

export type PurchaseOrderItemUpdateType = Omit<
  PurchaseOrderItemType,
  | 'id'
  | '_id'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseOrderId'
  | 'purchaseOrder'
>
