import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from '../purchase-order/purchase-order.schema'

@Schema({ collection: 'purchaseOrderHistory', timestamps: true })
export class PurchaseOrderHistory {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_order_id: Types.ObjectId

  @Prop()
  userId: number

  @Prop()
  time: Date

  @Prop()
  content: string

  @Prop({ type: Object })
  status: {
    before: PurchaseOrderStatus
    after: PurchaseOrderStatus
  }
}

const PurchaseOrderHistorySchema =
  SchemaFactory.createForClass(PurchaseOrderHistory)
PurchaseOrderHistorySchema.index({ _purchase_order_id: 1 }, { unique: false })

PurchaseOrderHistorySchema.virtual('purchaseOrder', {
  ref: 'PurchaseOrderSchema',
  localField: '_purchase_order_id',
  foreignField: '_id',
  justOne: true,
})
PurchaseOrderHistorySchema.virtual('purchaseOrderId').get(function () {
  return this._purchase_order_id.toHexString()
})

export { PurchaseOrderHistorySchema }

export type PurchaseOrderHistoryType = Omit<
  PurchaseOrderHistory,
  keyof Document<PurchaseOrderHistory>
> & {
  _id: Types.ObjectId
  id?: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
}

export type PurchaseOrderHistoryInsertType = Omit<
  PurchaseOrderHistoryType,
  'id' | '_id' | 'purchaseOrderId' | 'purchaseOrder'
>

export type PurchaseOrderHistoryUpdateType = Omit<
  PurchaseOrderHistoryType,
  'id' | '_id' | 'purchaseOrderId' | 'purchaseOrder'
>
