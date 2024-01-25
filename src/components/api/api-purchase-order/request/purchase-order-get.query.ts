import {
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'
import { LimitQuery, PaginationQuery } from '../../../../common/dto/query'
import {
  PurchaseOrderFilterQuery,
  PurchaseOrderRelationQuery,
  PurchaseOrderSortQuery,
} from './purchase-order-options.request'

export class PurchaseOrderGetQuery {
  @ApiPropertyOptional({ type: String, example: '{}' })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderRelationQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  relation: PurchaseOrderRelationQuery

  @ApiPropertyOptional({
    type: String,
    example: '{"isActive":1,"debt":{"GT":1500000}}',
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderFilterQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  filter?: PurchaseOrderFilterQuery

  @ApiPropertyOptional({ type: String, example: '{"id":"ASC"}' })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderSortQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  sort?: PurchaseOrderSortQuery
}

export class PurchaseOrderPaginationQuery extends IntersectionType(
  PurchaseOrderGetQuery,
  PaginationQuery
) {}

export class PurchaseOrderGetManyQuery extends IntersectionType(
  PickType(PurchaseOrderGetQuery, ['filter', 'relation']),
  LimitQuery
) {}

export class PurchaseOrderGetOneQuery extends PickType(PurchaseOrderGetQuery, [
  'relation',
]) {}
