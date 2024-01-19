import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsIn, IsMongoId, ValidateNested } from 'class-validator'
import { ConditionDate } from '../../../../common/dto/condition-date'
import { ConditionString } from '../../../../common/dto/condition-string'
import { SortQuery } from '../../../../common/dto/query'
import { valuesEnum } from '../../../../common/helpers'
import {
  PurchaseRequestStatusEnum,
  SourceAddress,
} from '../../../../mongo/purchase-request/purchase-request.schema'

export class PurchaseRequestRelationQuery {
  @Expose()
  @IsBoolean()
  purchaseRequestItemList: boolean
}

export class PurchaseRequestFilterQuery {
  @Expose()
  @Type(() => ConditionString)
  @ValidateNested({ each: true })
  code: ConditionString

  @Expose()
  @Type(() => ConditionDate)
  @ValidateNested({ each: true })
  requestDate: ConditionDate

  @Expose()
  @Type(() => ConditionDate)
  @ValidateNested({ each: true })
  receiveDate: ConditionDate

  @Expose()
  @IsMongoId()
  costCenterId: string

  @Expose()
  @IsIn(valuesEnum(SourceAddress))
  sourceAddress: SourceAddress // Chỉ sử dụng cho SMC

  @Expose()
  @IsMongoId()
  vendorId: string

  @Expose()
  @IsIn(valuesEnum(PurchaseRequestStatusEnum))
  status: PurchaseRequestStatusEnum
}

export class PurchaseRequestSortQuery extends SortQuery {
  @Expose()
  @IsIn(['ASC', 'DESC'])
  code: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  costCenterId: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  sourceAddress: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  vendorId: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  requestDate: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  receiveDate: 'ASC' | 'DESC'
}