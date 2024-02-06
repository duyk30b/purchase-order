import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseMongoRepository } from '../base-mongo.repository'
import {
  UserAction,
  UserActionInsertType,
  UserActionType,
  UserActionUpdateType,
} from './user-action.schema'

@Injectable()
export class UserActionRepository extends BaseMongoRepository<
  UserAction,
  UserActionType,
  { [P in '_id']?: 'ASC' | 'DESC' },
  { [P in keyof UserAction]?: never },
  UserActionInsertType,
  UserActionUpdateType
> {
  constructor(
    @InjectModel('UserActionSchema')
    private readonly userActionItemModel: Model<UserAction>
  ) {
    super(userActionItemModel)
  }
}
