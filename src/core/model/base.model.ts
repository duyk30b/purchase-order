import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseModel extends Document {
  @Prop()
  deletedAt?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
