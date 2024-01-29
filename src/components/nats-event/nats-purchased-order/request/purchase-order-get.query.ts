import { IntersectionType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { LimitQuery } from '../../../../common/dto/query'
import {
  PurchaseOrderFilterQuery,
  PurchaseOrderRelationQuery,
  PurchaseOrderSortQuery,
} from '../../../api/api-purchase-order/request'

export class PurchaseOrderGetRequest {
  @Expose()
  @Type(() => PurchaseOrderRelationQuery)
  @ValidateNested({ each: true })
  relation?: PurchaseOrderRelationQuery

  @Expose()
  @Type(() => PurchaseOrderFilterQuery)
  @ValidateNested({ each: true })
  filter?: PurchaseOrderFilterQuery

  @Expose()
  @Type(() => PurchaseOrderSortQuery)
  @ValidateNested({ each: true })
  sort?: PurchaseOrderSortQuery
}

export class PurchaseOrderGetManyRequest extends IntersectionType(
  PurchaseOrderGetRequest,
  LimitQuery
) {}

export class PurchaseOrderGetOneRequest extends PurchaseOrderGetRequest {}
