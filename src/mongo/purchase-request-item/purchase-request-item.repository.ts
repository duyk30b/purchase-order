import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseRequestItem,
  PurchaseRequestItemInsertType,
  PurchaseRequestItemType,
  PurchaseRequestItemUpdateType,
} from './purchase-request-item.schema'

@Injectable()
export class PurchaseRequestItemRepository extends BaseMongoRepository<
  PurchaseRequestItem,
  PurchaseRequestItemType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseRequest']?: boolean },
  PurchaseRequestItemInsertType,
  PurchaseRequestItemUpdateType
> {
  constructor(
    @InjectModel('PurchaseRequestItemSchema')
    private readonly purchaseRequestItemModel: Model<PurchaseRequestItem>
  ) {
    super(purchaseRequestItemModel)
  }
}
