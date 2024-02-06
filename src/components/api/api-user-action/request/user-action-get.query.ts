import {
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'
import { LimitQuery, PaginationQuery } from '../../../../common/dto/query'
import {
  UserActionFilterQuery,
  UserActionRelationQuery,
  UserActionSortQuery,
} from './user-action-options.request'

export class UserActionGetQuery {
  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<UserActionRelationQuery>{}),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(UserActionRelationQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  relation: UserActionRelationQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<UserActionFilterQuery>{
      searchText: '000000001',
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(UserActionFilterQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  filter?: UserActionFilterQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<UserActionSortQuery>{}),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(UserActionSortQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  sort?: UserActionSortQuery
}

export class UserActionPaginationQuery extends IntersectionType(
  UserActionGetQuery,
  PaginationQuery
) {}

export class UserActionGetManyQuery extends IntersectionType(
  PickType(UserActionGetQuery, ['filter', 'relation', 'sort']),
  LimitQuery
) {}

export class UserActionActionManyQuery extends PickType(UserActionGetQuery, [
  'filter',
]) {}

export class UserActionGetOneQuery extends PickType(UserActionGetQuery, [
  'relation',
]) {}

export class UserActionGetOneByIdQuery extends PickType(UserActionGetQuery, [
  'relation',
]) {}
