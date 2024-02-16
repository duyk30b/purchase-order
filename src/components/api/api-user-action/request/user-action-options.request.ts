import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { SortQuery } from '../../../../common/dto/query'

export class UserActionRelationQuery {}

export class UserActionFilterQuery {
  @Expose()
  @IsString()
  searchText: string
}

export class UserActionSortQuery extends SortQuery {}
