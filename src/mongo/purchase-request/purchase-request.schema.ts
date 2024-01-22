import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from '../base.schema'
import { PurchaseRequestItemType } from '../purchase-request-item/purchase-request-item.schema'

export enum PurchaseRequestStatusEnum {
  DRAFT = 1,
  WAIT_CONFIRM = 2,
  REJECT = 3,
  CONFIRM = 4,
  SUCCESS = 5,
  CANCEL = 6,
}

export enum SourceAddressEnum {
  VietNam = 'VietNam',
  Japan = 'Japan',
}

export enum SyncStatusEnum {
  BlockSync = 0, // Không đồng bộ
  NotSyncYet = 1, // Chưa đồng bộ
  SyncComplete = 2, // Đã đồng bộ
}

@Schema({ collection: 'purchaseRequest', timestamps: true })
export class PurchaseRequest extends BaseSchema {
  @Prop({ type: Number })
  status: PurchaseRequestStatusEnum

  @Prop()
  code: string

  @Prop()
  vendorId: string

  @Prop()
  requestDate: Date // Ngày yêu cầu

  @Prop()
  receiveDate: Date // Ngày nhận hàng

  @Prop()
  costCenterId: string

  @Prop()
  sourceAddress: SourceAddressEnum // Nguồn mua // Chỉ sử dụng cho SMC

  @Prop({ type: Number })
  syncStatus: SyncStatusEnum // Đồng bộ với nguồn mua // Chỉ sử dụng cho SMC

  @Prop()
  currencyId: number // Loại tiền tệ

  @Prop()
  userIdRequest: number // User yêu cầu

  @Prop()
  note: string
}

const PurchaseRequestSchema = SchemaFactory.createForClass(PurchaseRequest)
PurchaseRequestSchema.index({ code: 1 }, { unique: false })

PurchaseRequestSchema.virtual('purchaseRequestItemList', {
  ref: 'PurchaseRequestItem',
  localField: '_id',
  foreignField: '_purchase_request_id',
  justOne: false,
})

export { PurchaseRequestSchema }

export type PurchaseRequestType = Omit<PurchaseRequest, keyof Document<PurchaseRequest>> & {
  id?: string
  purchaseRequestItemList?: PurchaseRequestItemType[]
}

export type PurchaseRequestInsertType = Omit<
  PurchaseRequestType,
  'id' | '_id' | 'status' | 'purchaseRequestItemList'
>

export type PurchaseRequestUpdateType = Omit<
  PurchaseRequestType,
  'id' | '_id' | 'status' | 'purchaseRequestItemList' | 'code'
>
