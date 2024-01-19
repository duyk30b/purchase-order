import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import { PurchaseRequestItem, PurchaseRequestItemType } from './purchase-request-item.schema'

@Injectable()
export class PurchaseRequestItemRepository extends BaseMongoRepository<
  PurchaseRequestItem,
  PurchaseRequestItemType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseRequest']?: boolean }
> {
  constructor(
    @InjectModel('PurchaseRequestItemSchema')
    private readonly purchaseOrderItemModel: Model<PurchaseRequestItem>
  ) {
    super(purchaseOrderItemModel)
  }
}
