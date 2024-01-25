import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseRequestHistory,
  PurchaseRequestHistoryInsertType,
  PurchaseRequestHistoryType,
  PurchaseRequestHistoryUpdateType,
} from './purchase-request-history.schema'

@Injectable()
export class PurchaseRequestHistoryRepository extends BaseMongoRepository<
  PurchaseRequestHistory,
  PurchaseRequestHistoryType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseRequest']?: boolean },
  PurchaseRequestHistoryInsertType,
  PurchaseRequestHistoryUpdateType
> {
  constructor(
    @InjectModel('PurchaseRequestHistorySchema')
    private readonly purchaseRequestHistoryModel: Model<PurchaseRequestHistory>
  ) {
    super(purchaseRequestHistoryModel)
  }
}
