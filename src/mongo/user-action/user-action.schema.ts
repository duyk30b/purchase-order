import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum UserActionKey {
  CREATE_PO = 'CREATE_PO',
}

@Schema({ collection: 'userAction', timestamps: false, versionKey: false })
export class UserAction {
  @Prop()
  key: UserActionKey

  @Prop()
  userId: number
}

const UserActionSchema = SchemaFactory.createForClass(UserAction)

export { UserActionSchema }

export type UserActionType = Omit<UserAction, keyof Document<UserAction>> & {
  _id: Types.ObjectId
  id?: string
}

export type UserActionInsertType = Omit<UserActionType, 'id' | '_id'>

export type UserActionUpdateType = Omit<
  UserActionType,
  'id' | '_id' | 'createdAt' | 'createdByUserId'
>
