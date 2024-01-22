import { Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export class BaseSchema extends Document {
  @Prop()
  deletedAt?: Date

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date

  @Prop()
  createdByUserId: number

  @Prop()
  updatedByUserId: number
}
