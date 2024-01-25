import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import { PurchaseOrder, PurchaseOrderType } from './purchase-order.schema'

@Injectable()
export class PurchaseOrderRepository extends BaseMongoRepository<
  PurchaseOrder,
  PurchaseOrderType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in keyof PurchaseOrder]?: unknown }
> {
  constructor(
    @InjectModel('PurchaseOrderSchema')
    private readonly purchaseOrderModel: Model<PurchaseOrder>
  ) {
    super(purchaseOrderModel)
  }

  async incrementQuantity(
    condition: FilterQuery<PurchaseOrder>,
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
