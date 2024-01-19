import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import BigNumber from 'bignumber.js'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseRequest } from '../purchase-request/purchase-request.schema'

@Schema({ collection: 'purchaseRequestItem', timestamps: true })
export class PurchaseRequestItem extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_request_id: Types.ObjectId

  @Prop()
  itemId: number

  @Prop()
  itemTypeId: number

  @Prop()
  deliveryTerm?: Date // thời hạn giao hàng

  @Prop()
  itemUnitId: number

  @Prop()
  quantity: number

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _price: Types.Decimal128 // Đơn giá
}

const PurchaseRequestItemSchema = SchemaFactory.createForClass(PurchaseRequestItem)
PurchaseRequestItemSchema.index({ warehouseCode: 1 }, { unique: false })

PurchaseRequestItemSchema.virtual('price').get(function () {
  return new BigNumber(this._price.toString())
})

PurchaseRequestItemSchema.virtual('purchaseRequest', {
  ref: 'PurchaseRequest',
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
  id?: string
  price?: BigNumber
  purchaseRequestId?: string
  purchaseRequest?: PurchaseRequest
}
