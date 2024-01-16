import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'files',
  collation: DEFAULT_COLLATION,
})
export class File extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  resourceId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  resource: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  fileId: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  filename: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
