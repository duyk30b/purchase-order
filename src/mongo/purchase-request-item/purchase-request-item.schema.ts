import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseRequest } from '../purchase-request/purchase-request.schema'

@Schema({ collection: 'purchaseRequestItem', timestamps: true })
export class PurchaseRequestItem extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_request_id: Types.ObjectId

  @Prop()
  line: number // số line của sản phẩm trên PR

  @Prop()
  itemId: number

  @Prop()
  itemTypeId: number

  @Prop()
  deliveryTerm: number // thời hạn giao hàng => trường này phải lấy theo nhà cung cấp

  @Prop()
  itemUnitId: number // Đơn vị tính => trường này phải lấy theo nhà cung cấp

  @Prop()
  quantity: number

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _price: Types.Decimal128 // Đơn giá

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _amount: Types.Decimal128 // Tổng tiền
}

const PurchaseRequestItemSchema =
  SchemaFactory.createForClass(PurchaseRequestItem)
PurchaseRequestItemSchema.index({ _purchase_request_id: 1 }, { unique: false })
PurchaseRequestItemSchema.index({ itemId: 1 }, { unique: false })

PurchaseRequestItemSchema.virtual('price').get(function () {
  return this._price.toString()
})
PurchaseRequestItemSchema.virtual('amount').get(function () {
  return this._price.toString()
})

PurchaseRequestItemSchema.virtual('purchaseRequest', {
  ref: 'PurchaseRequestSchema',
  localField: '_purchase_request_id',
  foreignField: '_id',
  justOne: true,
})
PurchaseRequestItemSchema.virtual('purchaseRequestId').get(function () {
  return this._purchase_request_id.toHexString()
})

export { PurchaseRequestItemSchema }

export type PurchaseRequestItemType = Omit<
  PurchaseRequestItem,
  keyof Document<PurchaseRequestItem>
> & {
  _id: Types.ObjectId
  id?: string
  price?: string
  purchaseRequestId?: string
  purchaseRequest?: PurchaseRequest
}

export type PurchaseRequestItemInsertType = Omit<
  PurchaseRequestItemType,
  'id' | '_id' | 'purchaseRequestId' | 'purchaseRequest'
>

export type PurchaseRequestItemUpdateType = Omit<
  PurchaseRequestItemType,
  | 'id'
  | '_id'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseRequestId'
  | 'purchaseRequest'
>
