import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseOrderDeliveryItem,
  PurchaseOrderDeliveryItemInsertType,
  PurchaseOrderDeliveryItemType,
  PurchaseOrderDeliveryItemUpdateType,
} from './purchase-order-delivery-item.schema'

@Injectable()
export class PurchaseOrderDeliveryItemRepository extends BaseMongoRepository<
  PurchaseOrderDeliveryItem,
  PurchaseOrderDeliveryItemType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseOrder']?: boolean },
  PurchaseOrderDeliveryItemInsertType,
  PurchaseOrderDeliveryItemUpdateType
> {
  constructor(
    @InjectModel('PurchaseOrderDeliveryItemSchema')
    private readonly purchaseOrderDeliveryItemModel: Model<PurchaseOrderDeliveryItem>
  ) {
    super(purchaseOrderDeliveryItemModel)
  }
}
