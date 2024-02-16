import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PoDeliveryItem,
  PoDeliveryItemInsertType,
  PoDeliveryItemType,
  PoDeliveryItemUpdateType,
} from './po-delivery-item.schema'

@Injectable()
export class PoDeliveryItemRepository extends BaseMongoRepository<
  PoDeliveryItem,
  PoDeliveryItemType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in 'purchaseOrder']?: boolean },
  PoDeliveryItemInsertType,
  PoDeliveryItemUpdateType
> {
  constructor(
    @InjectModel('PoDeliveryItemSchema')
    private readonly poDeliveryItemModel: Model<PoDeliveryItem>
  ) {
    super(poDeliveryItemModel)
  }
}
