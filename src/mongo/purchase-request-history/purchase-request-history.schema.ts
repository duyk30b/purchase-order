import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  PurchaseRequest,
  PurchaseRequestStatus,
} from '../purchase-request/purchase-request.schema'

@Schema({ collection: 'purchaseRequestHistory', timestamps: true })
export class PurchaseRequestHistory {
  @Prop({ type: Types.ObjectId, required: true })
  _purchase_request_id: Types.ObjectId

  @Prop()
  userId: number

  @Prop()
  time: Date

  @Prop()
  content: string

  @Prop({ type: Object })
  status: {
    before: PurchaseRequestStatus
    after: PurchaseRequestStatus
  }
}

const PurchaseRequestHistorySchema = SchemaFactory.createForClass(
  PurchaseRequestHistory
)
PurchaseRequestHistorySchema.index(
  { _purchase_request_id: 1 },
  { unique: false }
)

PurchaseRequestHistorySchema.virtual('purchaseRequest', {
  ref: 'PurchaseRequestSchema',
  localField: '_purchase_request_id',
  foreignField: '_id',
  justOne: true,
})
PurchaseRequestHistorySchema.virtual('purchaseRequestId').get(function () {
  return this._purchase_request_id.toHexString()
})

export { PurchaseRequestHistorySchema }

export type PurchaseRequestHistoryType = Omit<
  PurchaseRequestHistory,
  keyof Document<PurchaseRequestHistory>
> & {
  id?: string
  purchaseRequestId?: string
  purchaseRequest?: PurchaseRequest
}

export type PurchaseRequestHistoryInsertType = Omit<
  PurchaseRequestHistoryType,
  'id' | '_id' | 'purchaseRequestId' | 'purchaseRequest'
>

export type PurchaseRequestHistoryUpdateType = Omit<
  PurchaseRequestHistoryType,
  'id' | '_id' | 'purchaseRequestId' | 'purchaseRequest'
>
