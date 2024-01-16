import { Model, Schema } from 'mongoose';

export function transformId(
  schema: Schema<any, Model<any, any, any, any>, unknown>,
) {
  schema.set('toJSON', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  });
}
