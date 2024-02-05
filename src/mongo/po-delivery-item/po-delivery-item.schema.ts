import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseOrder } from '../purchase-order/purchase-order.schema'

@Schema({ collection: 'poDeliveryItem', timestamps: true })
export class PoDeliveryItem extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_order_id: Types.ObjectId

  @Prop({ type: Types.ObjectId, required: true })
  _purchase_order_item_id: Types.ObjectId

  @Prop()
  itemId: number

  @Prop()
  itemUnitId: number // Đơn vị tính

  @Prop({ required: false })
  deliveryTerm: number // thời hạn giao hàng

  @Prop()
  quantityBuy: number // số lượng mua

  @Prop()
  quantityDelivery: number // số lượng giao

  @Prop()
  warehouseIdReceiving: number // kho nhận

  @Prop({ required: false })
  deliveryDate: Date // ngày giao kế hoạch
}

const PoDeliveryItemSchema = SchemaFactory.createForClass(PoDeliveryItem)
PoDeliveryItemSchema.index({ _purchase_order_id: 1 }, { unique: false })
PoDeliveryItemSchema.index({ itemId: 1 }, { unique: false })

PoDeliveryItemSchema.virtual('purchaseOrder', {
  ref: 'PurchaseOrderSchema',
  localField: '_purchase_order_id',
  foreignField: '_id',
  justOne: true,
})
PoDeliveryItemSchema.virtual('purchaseOrderId').get(function () {
  return this._purchase_order_id.toHexString()
})
PoDeliveryItemSchema.virtual('purchaseOrderItemId').get(function () {
  return this._purchase_order_item_id.toHexString()
})

export { PoDeliveryItemSchema }

export type PoDeliveryItemType = Omit<
  PoDeliveryItem,
  keyof Document<PoDeliveryItem>
> & {
  id?: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
  purchaseOrderItemId?: string
}

export type PoDeliveryItemInsertType = Omit<
  PoDeliveryItemType,
  'id' | '_id' | 'purchaseOrderId' | 'purchaseOrder'
>

export type PoDeliveryItemUpdateType = Omit<
  PoDeliveryItemType,
  | 'id'
  | '_id'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseOrderId'
  | 'purchaseOrder'
>
