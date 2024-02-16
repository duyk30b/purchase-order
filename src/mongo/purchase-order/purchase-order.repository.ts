import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  PurchaseOrder,
  PurchaseOrderInsertType,
  PurchaseOrderType,
  PurchaseOrderUpdateType,
} from './purchase-order.schema'

@Injectable()
export class PurchaseOrderRepository extends BaseMongoRepository<
  PurchaseOrder,
  PurchaseOrderType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  {
    [P in
      | 'purchaseOrderItems'
      | 'poDeliveryItems'
      | 'purchaseOrderHistories']?: boolean
  },
  PurchaseOrderInsertType,
  PurchaseOrderUpdateType
> {
  constructor(
    @InjectModel('PurchaseOrderSchema')
    private readonly purchaseOrderModel: Model<PurchaseOrder>
  ) {
    super(purchaseOrderModel)
  }

  public async generateNextCode(options: {
    prefix?: string
    padSize?: number
    padChar?: string
  }): Promise<string> {
    const prefix = options.prefix || 'PO-'
    const padSize = options.padSize || 7
    const padChar = options.padChar || '0'
    const lastDocument = await this.purchaseOrderModel
      .findOne({ code: { $regex: new RegExp(`^${prefix}`, 'i') } })
      .sort({ code: -1 })
    const lastCode = lastDocument?.toObject()?.code || ''
    const lastNumber = +lastCode.replace(prefix, '') || 0
    const currentNumber = (lastNumber + 1).toString().padStart(padSize, padChar)
    return `${prefix}${currentNumber}`
  }
}
