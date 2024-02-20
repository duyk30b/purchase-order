import { Expose, Transform, Type } from 'class-transformer'
import {
  Allow,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ConditionDate } from '../../../../common/dto/condition-date'
import {
  ConditionMongoId,
  transformConditionMongoId,
} from '../../../../common/dto/condition-mongo-id'
import {
  ConditionString,
  transformConditionString,
} from '../../../../common/dto/condition-string'
import { SortQuery } from '../../../../common/dto/query'
import { valuesEnum } from '../../../../common/helpers'
import {
  PurchaseRequestStatus,
  SourceAddress,
} from '../../../../mongo/purchase-request/purchase-request.schema'

export class PurchaseRequestRelationQuery {
  @Expose()
  @IsBoolean()
  purchaseRequestItems: boolean

  @Expose()
  @IsBoolean()
  purchaseRequestHistories: boolean
}

export class PurchaseRequestFilterQuery {
  @Expose()
  @Transform(transformConditionMongoId)
  @Allow()
  id: string | ConditionMongoId

  @Expose()
  @Transform(transformConditionString)
  @ValidateNested({ each: true })
  code: ConditionString

  @Expose()
  @IsString()
  searchText: string

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
  supplierId: string

  @Expose()
  @IsIn(valuesEnum(PurchaseRequestStatus))
  status: PurchaseRequestStatus
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
