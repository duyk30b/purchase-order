import { IntersectionType, PickType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { LimitQuery, PaginationQuery } from '../../../../common/dto/query'
import {
  PurchaseRequestFilterQuery,
  PurchaseRequestRelationQuery,
  PurchaseRequestSortQuery,
} from '../../../api/api-purchase-request/request'

export class PurchaseRequestGetQuery {
  @Expose()
  @Type(() => PurchaseRequestRelationQuery)
  @ValidateNested({ each: true })
  relation: PurchaseRequestRelationQuery

  @Expose()
  @Type(() => PurchaseRequestFilterQuery)
  @ValidateNested({ each: true })
  filter?: PurchaseRequestFilterQuery

  @Expose()
  @Type(() => PurchaseRequestSortQuery)
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

export class PurchaseRequestActionManyQuery extends PickType(
  PurchaseRequestGetQuery,
  ['filter']
) {}

export class PurchaseRequestGetOneQuery extends PurchaseRequestGetQuery {}

export class PurchaseRequestGetOneByIdQuery extends PickType(
  PurchaseRequestGetQuery,
  ['relation']
) {}
