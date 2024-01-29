import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseRequestItemType } from '../purchase-request-item/purchase-request-item.schema'

export enum PurchaseRequestStatus {
  DRAFT = 1,
  WAIT_CONFIRM = 2, // đề nghị duyệt
  REJECT = 3,
  CONFIRM = 4,
  SUCCESS = 5,
  CANCEL = 6,
}

export enum SourceAddress {
  VietNam = 'VietNam',
  Japan = 'Japan',
}

export enum SyncStatus {
  BlockSync = 0, // Không đồng bộ
  NotSyncYet = 1, // Chưa đồng bộ
  SyncComplete = 2, // Đã đồng bộ
}

@Schema({ collection: 'purchaseRequest', timestamps: true })
export class PurchaseRequest extends BaseSchema {
  @Prop({ type: Number })
  status: PurchaseRequestStatus

  @Prop()
  code: string

  @Prop()
  supplierId: string

  @Prop()
  requestDate: Date // Ngày yêu cầu

  @Prop()
  receiveDate: Date // Ngày nhận hàng

  @Prop()
  costCenterId: string

  @Prop()
  sourceAddress: SourceAddress // Nguồn mua // Chỉ sử dụng cho SMC

  @Prop({ type: Number })
  syncStatus: SyncStatus // Đồng bộ với nguồn mua // Chỉ sử dụng cho SMC

  @Prop()
  currencyId: number // Loại tiền tệ

  @Prop()
  userIdRequest: number // User yêu cầu

  @Prop()
  note: string
}

const PurchaseRequestSchema = SchemaFactory.createForClass(PurchaseRequest)
PurchaseRequestSchema.index({ code: 1 }, { unique: false })

PurchaseRequestSchema.virtual('purchaseRequestItems', {
  ref: 'PurchaseRequestItemSchema',
  localField: '_id',
  foreignField: '_purchase_request_id',
  justOne: false,
})

export { PurchaseRequestSchema }

export type PurchaseRequestType = Omit<
  PurchaseRequest,
  keyof Document<PurchaseRequest>
> & {
  id?: string
  purchaseRequestItems?: PurchaseRequestItemType[]
}

export type PurchaseRequestInsertType = Omit<
  PurchaseRequestType,
  'id' | '_id' | 'purchaseRequestItems'
>

export type PurchaseRequestUpdateType = Omit<
  PurchaseRequestType,
  | 'id'
  | '_id'
  | 'createdAt'
  | 'createdByUserId'
  | 'purchaseRequestItems'
  | 'code'
>
