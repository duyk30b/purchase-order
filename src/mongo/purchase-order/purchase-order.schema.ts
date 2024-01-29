import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseOrderItemType } from '../purchase-order-item/purchase-order-item.schema'

export enum PurchaseOrderStatus {
  DRAFT = 1,
  WAIT_CONFIRM = 2, // đề nghị duyệt
  REJECT = 3,
  CONFIRM = 4,
  WAITING_DELIVERY = 5, // chờ giao
  DELIVERING = 6, // đang giao
  SUCCESS = 7,
  CANCEL = 8,
}

export enum OrderType {
  IMPORT = 1, // Nhập khẩu
  DOMESTIC = 2, // Nội địa
}

export enum DeliveryNumber {
  ONE_TIME = 1, // giao hàng một lần
  REPEATEDLY = 2, // giao hàng nhiều lần
}

@Schema({ collection: 'purchaseOrder', timestamps: true })
export class PurchaseOrder extends BaseSchema {
  @Prop({ type: Number })
  status: PurchaseOrderStatus

  @Prop()
  code: string

  @Prop()
  purchaseRequestCode: string

  @Prop()
  supplierId: string

  @Prop()
  orderDate: Date // ngày đặt hàng

  @Prop({ type: Number })
  purchaseOrderType: OrderType // loại đơn hàng

  @Prop()
  incotermsId: string // International Commercial Terms (Incoterms) – Điều khoản thương mại quốc tế

  @Prop()
  manufacturingCountryId: number // nước sản xuất

  @Prop()
  contractCode: string // Mã hợp đồng

  @Prop()
  priceIncludesTax: boolean // giá đã bao gồm thuế

  @Prop()
  currencyId: number // Loại tiền tệ

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _total_money: Types.Decimal128 // Tổng tiền (tổng tiền của tất cả sản phẩm)

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _tax_money: Types.Decimal128 // Tổng tiền thuế (tổng tiền thuế của tất cả sản phẩm)

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _amount: Types.Decimal128 // Thành tiền (_total_money + _tax_money)

  @Prop({ type: Number })
  deliveryNumber: DeliveryNumber // giao hàng 1 lần hay nhiều lần

  @Prop({ required: false })
  deliveryDate: Date // ngày giao hàng

  @Prop()
  deliveryMethodCode: string // phương thức vận chuyển

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _delivery_expense: Types.Decimal128 // Chi phí vận chuyển
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)
PurchaseOrderSchema.index({ code: 1 }, { unique: false })

PurchaseOrderSchema.virtual('purchaseOrderItems', {
  ref: 'PurchaseOrderItemSchema',
  localField: '_id',
  foreignField: '_purchase_order_id',
  justOne: false,
})

PurchaseOrderSchema.virtual('totalMoney').get(function () {
  return this._total_money.toString()
})
PurchaseOrderSchema.virtual('taxMoney').get(function () {
  return this._tax_money.toString()
})
PurchaseOrderSchema.virtual('amount').get(function () {
  return this._amount.toString()
})

export { PurchaseOrderSchema }

export type PurchaseOrderType = Omit<
  PurchaseOrder,
  keyof Document<PurchaseOrder>
> & {
  id?: string
  purchaseOrderItems?: PurchaseOrderItemType[]
  totalMoney?: string
  taxMoney?: string
  amount?: string
}

export type PurchaseOrderInsertType = Omit<
  PurchaseOrderType,
  'id' | '_id' | 'purchaseOrderItems'
>

export type PurchaseOrderUpdateType = Omit<
  PurchaseOrderType,
  'id' | '_id' | 'createdAt' | 'createdByUserId' | 'purchaseOrderItems' | 'code'
>
