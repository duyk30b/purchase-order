import { ConditionNumber } from '../../../../../common/dto/condition-number'
import { ConditionString } from '../../../../../common/dto/condition-string'
import { OmitClass, PickClass } from '../../../../../common/helpers'

export class IncotermRelationRequest {}

export class IncotermFilterRequest {
  id?: ConditionNumber | number
  code?: ConditionString | string
}

export class IncotermSortRequest {
  id?: 'ASC' | 'DESC'
  code?: 'ASC' | 'DESC'
}

export class IncotermGetRequest {
  page?: number
  limit?: number
  relation?: IncotermRelationRequest
  filter?: IncotermFilterRequest
  sort?: IncotermSortRequest
}

export class IncotermPaginationRequest extends IncotermGetRequest {}
export class IncotermGetManyRequest extends OmitClass(IncotermGetRequest, [
  'page',
]) {}
export class IncotermGetOneRequest extends PickClass(IncotermGetRequest, [
  'filter',
  'relation',
]) {}

export class IncotermGetOneByIdRequest extends PickClass(IncotermGetRequest, [
  'relation',
]) {}
