import { Expose, Transform, Type } from 'class-transformer'
import {
  Allow,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ConditionDate } from '../../../../common/dto/condition-date'
import {
  ConditionMongoId,
  transformConditionMongoId,
} from '../../../../common/dto/condition-mongo-id'
import { ConditionString } from '../../../../common/dto/condition-string'
import { SortQuery } from '../../../../common/dto/query'
import { valuesEnum } from '../../../../common/helpers'
import {
  PoPaymentStatus,
  PurchaseOrderKind,
  PurchaseOrderStatus,
} from '../../../../mongo/purchase-order/purchase-order.schema'

export class PurchaseOrderRelationQuery {
  @Expose()
  @IsBoolean()
  purchaseOrderItems: boolean

  @Expose()
  @IsBoolean()
  poDeliveryItems: boolean

  @Expose()
  @IsBoolean()
  purchaseOrderHistories: boolean
}

export class PurchaseOrderFilterQuery {
  @Expose()
  // @Transform(({ value }) => transformConditionMongoId(value))
  @Allow()
  id: string | ConditionMongoId

  @Expose()
  @IsString()
  searchText: string

  @Expose()
  @Type(() => ConditionString)
  @ValidateNested({ each: true })
  code: string | ConditionString

  @Expose()
  @Type(() => ConditionString)
  @ValidateNested({ each: true })
  purchaseRequestCode: ConditionString

  @Expose()
  @Type(() => ConditionDate)
  @ValidateNested({ each: true })
  orderDate: ConditionDate // ngày đặt hàng

  @Expose()
  @Type(() => ConditionDate)
  @ValidateNested({ each: true })
  deliveryDate: ConditionDate // ngày giao hàng

  @Expose()
  @IsMongoId()
  supplierId: string

  @Expose()
  @IsIn(valuesEnum(PurchaseOrderKind))
  purchaseOrderKind: PurchaseOrderKind // loại đơn hàng

  @Expose()
  @IsPositive()
  createdByUserId: number

  @Expose()
  @IsIn(valuesEnum(PoPaymentStatus))
  poPaymentStatus: PoPaymentStatus // trạng thái thanh toán

  @Expose()
  @IsIn(valuesEnum(PurchaseOrderStatus))
  status: PurchaseOrderStatus // trạng thái đơn mua hàng
}

export class PurchaseOrderSortQuery extends SortQuery {
  @Expose()
  @IsIn(['ASC', 'DESC'])
  code: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  purchaseRequestCode: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  supplierId: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  orderDate: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  deliveryDate: 'ASC' | 'DESC'
}
