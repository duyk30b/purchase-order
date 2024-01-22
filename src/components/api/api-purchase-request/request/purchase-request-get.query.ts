import { ApiPropertyOptional, IntersectionType, PickType } from '@nestjs/swagger'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'
import { LimitQuery, PaginationQuery } from '../../../../common/dto/query'
import {
  PurchaseRequestStatusEnum,
  SourceAddressEnum,
} from '../../../../mongo/purchase-request/purchase-request.schema'
import {
  PurchaseRequestFilterQuery,
  PurchaseRequestRelationQuery,
  PurchaseRequestSortQuery,
} from './purchase-request-options.request'

export class PurchaseRequestGetQuery {
  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify({ purchaseRequestItemList: true }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseRequestRelationQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  relation: PurchaseRequestRelationQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<PurchaseRequestFilterQuery>{
      searchText: { LIKE: 'RQ' },
      requestDate: { GTE: new Date() },
      receiveDate: { LT: new Date() },
      costCenterId: '63fdde9517a7317f0e8f959a',
      sourceAddress: SourceAddressEnum.Japan,
      vendorId: '63fdde9517a7317f0e8f959a',
      status: PurchaseRequestStatusEnum.DRAFT,
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseRequestFilterQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  filter?: PurchaseRequestFilterQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<PurchaseRequestSortQuery>{
      code: 'ASC',
      costCenterId: 'DESC',
      sourceAddress: 'ASC',
      vendorId: 'DESC',
      requestDate: 'ASC',
      receiveDate: 'ASC',
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseRequestSortQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  sort?: PurchaseRequestSortQuery
}

export class PurchaseRequestPaginationQuery extends IntersectionType(
  PurchaseRequestGetQuery,
  PaginationQuery
) {}

export class PurchaseRequestGetManyQuery extends IntersectionType(
  PickType(PurchaseRequestGetQuery, ['filter', 'relation']),
  LimitQuery
) {}

export class PurchaseRequestGetOneQuery extends PickType(PurchaseRequestGetQuery, ['relation']) {}
