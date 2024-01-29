import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
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

  @Prop()
  quantityBuy: number // số lượng mua

  @Prop()
  quantityDelivery: number // số lượng giao

  @Prop()
  warehouseIdReceiving: number // kho nhận

  @Prop({ required: false })
  deliveryDate: Date // ngày giao kế hoạch
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

export { PurchaseOrderDeliveryItemSchema }

export type PurchaseOrderDeliveryItemType = Omit<
  PurchaseOrderDeliveryItem,
  keyof Document<PurchaseOrderDeliveryItem>
> & {
  id?: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
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
