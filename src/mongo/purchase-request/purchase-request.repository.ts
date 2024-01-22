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
    private readonly purchaseRequestModel: Model<PurchaseRequest>
  ) {
    super(purchaseRequestModel)
  }

  public async generateNextCode(options: {
    prefix?: string
    padSize?: number
    padChar?: string
  }): Promise<string> {
    const prefix = options.prefix || 'PR-'
    const padSize = options.padSize || 7
    const padChar = options.padChar || '0'
    const lastDocument = await this.purchaseRequestModel
      .findOne({ code: { $regex: new RegExp(`^${prefix}`, 'i') } })
      .sort({ code: -1 })
    const lastCode = lastDocument?.toObject()?.code || ''
    const lastNumber = +lastCode.replace(prefix, '') || 0
    const currentNumber = (lastNumber + 1).toString().padStart(padSize, padChar)
    return `${prefix}${currentNumber}`
  }

  async incrementQuantity(
    condition: FilterQuery<PurchaseRequest>,
    options: {
      quantityAvailable: string
    }
  ) {
    const filter = this.getFilterOptions(condition)
    return await this.purchaseRequestModel.findOneAndUpdate(
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
