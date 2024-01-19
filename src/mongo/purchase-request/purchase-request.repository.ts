import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseRequest,
  PurchaseRequestInsertType,
  PurchaseRequestType,
  PurchaseRequestUpdateType,
} from './purchase-request.schema'

@Injectable()
export class PurchaseRequestRepository extends BaseMongoRepository<
  PurchaseRequest,
  PurchaseRequestType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in keyof PurchaseRequest]?: unknown },
  PurchaseRequestInsertType,
  PurchaseRequestUpdateType
> {
  constructor(
    @InjectModel('PurchaseRequestSchema')
    private readonly purchaseOrderModel: Model<PurchaseRequest>
  ) {
    super(purchaseOrderModel)
  }

  async incrementQuantity(
    condition: FilterQuery<PurchaseRequest>,
    options: {
      quantityAvailable: string
    }
  ) {
    const filter = this.getFilterOptions(condition)
    return await this.purchaseOrderModel.findOneAndUpdate(
      filter,
      {
        $inc: {
          _quantity_available: new Types.Decimal128(options.quantityAvailable),
        },
      },
      { new: true }
    )
  }
}
