import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseOrderItem,
  PurchaseOrderItemInsertType,
  PurchaseOrderItemType,
  PurchaseOrderItemUpdateType,
} from './purchase-order-item.schema'

@Injectable()
export class PurchaseOrderItemRepository extends BaseMongoRepository<
  PurchaseOrderItem,
  PurchaseOrderItemType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseOrder']?: boolean },
  PurchaseOrderItemInsertType,
  PurchaseOrderItemUpdateType
> {
  constructor(
    @InjectModel('PurchaseOrderItemSchema')
    private readonly purchaseOrderItemModel: Model<PurchaseOrderItem>
  ) {
    super(purchaseOrderItemModel)
  }
}
