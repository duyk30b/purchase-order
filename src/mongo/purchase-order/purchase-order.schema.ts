import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import BigNumber from 'bignumber.js'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'

@Schema({ collection: 'purchaseOrder', timestamps: true })
export class PurchaseOrder extends BaseSchema {
  @Prop()
  status: number

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _quantity_available: Types.Decimal128 // số lượng tính theo đơn vị tính chính

  @Prop()
  description: string

  @Prop()
  note: string
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)
PurchaseOrderSchema.index({ warehouseCode: 1 }, { unique: false })

PurchaseOrderSchema.virtual('quantityAvailable').get(function () {
  return new BigNumber(this._quantity_available.toString())
})

// PurchaseOrderSchema.virtual('itemStock', {
//   ref: 'ItemStock',
//   localField: '_item_stock_id',
//   foreignField: '_id',
//   justOne: true,
// })
// PurchaseOrderSchema.virtual('itemStockId').get(function () {
//   return this._item_stock_id.toHexString()
// })

export { PurchaseOrderSchema }

export type PurchaseOrderType = Omit<PurchaseOrder, keyof Document<PurchaseOrder>> & {
  id?: string
  quantityAvailable?: BigNumber
  // itemStock?: ItemStock
}

// export type PurchaseOrderType = LeanDocument<PurchaseOrder> & {
//   id?: string
//   quantityAvailable?: BigNumber
//   itemStock?: ItemStock
// }
