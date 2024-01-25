import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ConditionDate } from '../../../../common/dto/condition-date'
import { ConditionNumber } from '../../../../common/dto/condition-number'
import { SortQuery } from '../../../../common/dto/query'

export class PurchaseOrderRelationQuery {
  @Expose()
  @IsBoolean()
  vendor: boolean
}

export class PurchaseOrderFilterQuery {
  @Expose()
  @IsIn([0, 1])
  isActive: 0 | 1

  @Expose()
  @IsNotEmpty()
  @IsString()
  searchText: string

  @Expose()
  @Type(() => ConditionNumber)
  @ValidateNested({ each: true })
  debt: ConditionNumber

  @Expose()
  @Type(() => ConditionDate)
  @ValidateNested({ each: true })
  updatedAt: ConditionDate
}

export class PurchaseOrderSortQuery extends SortQuery {
  @Expose()
  @IsIn(['ASC', 'DESC'])
  debt: 'ASC' | 'DESC'

  @Expose()
  @IsIn(['ASC', 'DESC'])
  fullName: 'ASC' | 'DESC'
}
