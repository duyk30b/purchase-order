import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, Types } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PoDeliveryItemType } from '../po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderHistoryType } from '../purchase-order-history/purchase-order-history.schema'
import { PurchaseOrderItemType } from '../purchase-order-item/purchase-order-item.schema'

export enum PurchaseOrderStatus {
  DRAFT = 1,
  WAIT_CONFIRM = 2, // đề nghị duyệt
  REJECT = 3,
  CONFIRM = 4,
  WAIT_DELIVERY = 5, // chờ giao
  DELIVERING = 6, // đang giao
  SUCCESS = 7,
  CANCEL = 8,
}

export enum PurchaseOrderKind {
  IMPORT = 1, // Nhập khẩu
  DOMESTIC = 2, // Nội địa
}

export enum DeliveryKind {
  ONE_TIME = 1, // giao hàng một lần
  REPEATEDLY = 2, // giao hàng nhiều lần
}

// phương thức vận chuyển
export enum DeliveryMethod {
  AIR = 'AIR',
  SEA = 'SEA',
  COURIER = 'COURIER',
  RAILROAD = 'RAILROAD',
  SEA_AND_AIR = 'SEA&AIR',
}

export const PaymentPeriod = {
  1: {}, //. Sau khi nhận hàng và kiểm tra chất lượng/ Chốt công nợ vào cuối tháng nhận hàng/Thanh toán vào ngày 20 của tháng kế tiếp (cùng với đầy đủ các chứng từ mua bán hợp lệ đi kèm)
  2: {}, //. Sau khi nhận hàng và kiểm tra chất lượng/Trong vòng 14 ngày kể từ ngày nhận hàng đầu tiên (cùng với đầy đủ các chứng từ mua bán hợp lệ đi kèm)
  3: {}, //. Sau khi nhận hàng/ Chốt công nợ vào cuối tháng nhận hàng/Thanh toán vào ngày 20 của tháng kế tiếp(cùng với đầy đủ các chứng từ mua bán hợp lệ đi kèm)
  4: {}, //. Sau khi nhận hàng /Trong vòng 14 ngày kể từ ngày đầu tiên nhận hàng(cùng với đầy đủ các chứng từ mua bán hợp lệ đi kèm)
  5: {}, //. Kể từ ngày Surrender B/L phát hành/Chốt công nợ vào cuối tháng nhận hàng/Thanh toán vào ngày 20 tháng kế tiếp
  6: {}, //. Kể từ ngày Surrender B/L phát hành/Trong vòng 14 ngày kể từ ngày đầu tiên nhận giấy giao hàng
}

export enum PoPaymentStatus {
  UNPAID = 1, // Chưa thanh toán
  PARTIAL = 2, // Thanh toán một phần
  PAYOFF = 3, // Thanh toán hết
}

@Schema() // kế hoạch thanh toán
export class PoPaymentPlan {
  @Prop()
  expectedDate: Date // ngày dự kiến

  @Prop()
  paymentMethod: number // Phương thức thanh toán

  @Prop()
  paymentPercent: number // phần trăm thanh toán: tỉ lệ phần trăm của lần thanh toán này

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _amount: Types.Decimal128 // Thành tiền

  @Prop({ type: String, maxlength: 50 })
  description: string
}

export class PoAttachFile {
  @Prop()
  fileId: string

  @Prop()
  fileName: string

  @Prop()
  link: string

  @Prop()
  size: number

  @Prop()
  description: string
}

export class PoNote {
  @Prop()
  date: Date

  @Prop()
  userId: number

  @Prop()
  content: string
}

@Schema({ collection: 'purchaseOrder', timestamps: true })
export class PurchaseOrder extends BaseSchema {
  @Prop({ type: Number })
  status: PurchaseOrderStatus

  @Prop({ type: Number })
  poPaymentStatus: PoPaymentStatus

  @Prop()
  code: string

  @Prop()
  purchaseRequestCode: string

  @Prop()
  supplierId: string

  @Prop()
  orderDate: Date // ngày đặt hàng

  @Prop({ type: Number })
  purchaseOrderKind: PurchaseOrderKind // loại đơn hàng

  @Prop()
  incotermId: number // International Commercial Terms (Incoterms) – Điều khoản thương mại quốc tế

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

  // ========== Thông tin giao hàng ==========
  @Prop({ type: Number })
  deliveryKind: DeliveryKind // giao hàng 1 lần hay nhiều lần

  @Prop({ required: false })
  deliveryDate: Date // ngày giao hàng

  @Prop({ type: String })
  deliveryMethod: DeliveryMethod // phương thức vận chuyển

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  _delivery_expense: Types.Decimal128 // Chi phí vận chuyển

  @Prop()
  departure: string // nơi đi

  @Prop()
  destination: string // nơi đến

  @Prop()
  pack: string // đóng gói

  // ========== Kế hoạch thanh toán ==========
  @Prop({ type: Number })
  paymentPeriodId: number // kỳ thanh toán

  @Prop({ type: mongoose.Schema.Types.Array })
  poPaymentPlans: PoPaymentPlan[]

  @Prop({ type: mongoose.Schema.Types.Array })
  poAttachFiles: PoAttachFile[]

  @Prop({ type: mongoose.Schema.Types.Array })
  poNotes: PoNote[]
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)
PurchaseOrderSchema.index({ code: 1 }, { unique: false })

PurchaseOrderSchema.virtual('purchaseOrderItems', {
  ref: 'PurchaseOrderItemSchema',
  localField: '_id',
  foreignField: '_purchase_order_id',
  justOne: false,
})

PurchaseOrderSchema.virtual('poDeliveryItems', {
  ref: 'PoDeliveryItemSchema',
  localField: '_id',
  foreignField: '_purchase_order_id',
  justOne: false,
})

PurchaseOrderSchema.virtual('purchaseOrderHistories', {
  ref: 'PurchaseOrderHistorySchema',
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
PurchaseOrderSchema.virtual('deliveryExpense').get(function () {
  return this._delivery_expense.toString()
})

export { PurchaseOrderSchema }

export type PurchaseOrderType = Omit<
  PurchaseOrder,
  keyof Document<PurchaseOrder>
> & {
  _id: Types.ObjectId
  id?: string
  purchaseOrderItems?: PurchaseOrderItemType[]
  poDeliveryItems?: PoDeliveryItemType[]
  purchaseOrderHistories?: PurchaseOrderHistoryType[]
  totalMoney?: string
  taxMoney?: string
  amount?: string
  deliveryExpense?: string
}

export type PurchaseOrderInsertType = Omit<
  PurchaseOrderType,
  | 'id'
  | '_id'
  | 'purchaseOrderItems'
  | 'poDeliveryItems'
  | 'purchaseOrderHistories'
>

export type PurchaseOrderUpdateType = Omit<
  PurchaseOrderType,
  | 'id'
  | '_id'
  | 'code'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseOrderItems'
  | 'poDeliveryItems'
  | 'purchaseOrderHistories'
>
