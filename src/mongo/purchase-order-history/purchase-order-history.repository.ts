import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseOrderHistory,
  PurchaseOrderHistoryInsertType,
  PurchaseOrderHistoryType,
  PurchaseOrderHistoryUpdateType,
} from './purchase-order-history.schema'

@Injectable()
export class PurchaseOrderHistoryRepository extends BaseMongoRepository<
  PurchaseOrderHistory,
  PurchaseOrderHistoryType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseOrder']?: boolean },
  PurchaseOrderHistoryInsertType,
  PurchaseOrderHistoryUpdateType
> {
  constructor(
    @InjectModel('PurchaseOrderHistorySchema')
    private readonly purchaseOrderHistoryModel: Model<PurchaseOrderHistory>
  ) {
    super(purchaseOrderHistoryModel)
  }
}
