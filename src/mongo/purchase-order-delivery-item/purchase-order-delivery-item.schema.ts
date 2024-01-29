import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseOrder } from '../purchase-order/purchase-order.schema'

@Schema({ collection: 'purchaseOrderItem', timestamps: true })
export class PurchaseOrderDeliveryItem extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_order_id: Types.ObjectId

  @Prop()
  itemId: number

  @Prop()
  itemUnitId: number // Đơn vị tính

  @Prop()
  deliveryTerm: Date // thời hạn giao hàng

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

  // @Prop()
  // deliveryTerm: Date // thời hạn giao hàng => trường này phải lấy theo nhà cung cấp
}

const PurchaseOrderDeliveryItemSchema = SchemaFactory.createForClass(
  PurchaseOrderDeliveryItem
)
PurchaseOrderDeliveryItemSchema.index(
  { _purchase_order_id: 1 },
  { unique: false }
)
PurchaseOrderDeliveryItemSchema.index({ itemId: 1 }, { unique: false })

PurchaseOrderDeliveryItemSchema.virtual('purchaseOrder', {
  ref: 'PurchaseOrderSchema',
  localField: '_purchase_order_id',
  foreignField: '_id',
  justOne: true,
})
PurchaseOrderDeliveryItemSchema.virtual('purchaseOrderId').get(function () {
  return this._purchase_order_id.toHexString()
})

PurchaseOrderDeliveryItemSchema.virtual('price').get(function () {
  return this._price.toString()
})
PurchaseOrderDeliveryItemSchema.virtual('totalMoney').get(function () {
  return this._total_money.toString()
})
PurchaseOrderDeliveryItemSchema.virtual('amount').get(function () {
  return this._amount.toString()
})

export { PurchaseOrderDeliveryItemSchema }

export type PurchaseOrderDeliveryItemType = Omit<
  PurchaseOrderDeliveryItem,
  keyof Document<PurchaseOrderDeliveryItem>
> & {
  id?: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
  price?: string
  totalMoney?: string
  amount?: string
}

export type PurchaseOrderDeliveryItemInsertType = Omit<
  PurchaseOrderDeliveryItemType,
  'id' | '_id' | 'purchaseOrderId' | 'purchaseOrder'
>

export type PurchaseOrderDeliveryItemUpdateType = Omit<
  PurchaseOrderDeliveryItemType,
  | 'id'
  | '_id'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseOrderId'
  | 'purchaseOrder'
>
