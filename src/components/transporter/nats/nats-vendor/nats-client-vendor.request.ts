import { ConditionMongoId } from '../../../../common/dto/condition-mongo-id'
import { ConditionNumber } from '../../../../common/dto/condition-number'
import { ConditionString } from '../../../../common/dto/condition-string'
import { OmitClass, PickClass } from '../../../../common/helpers'
import {
  SUPPLIER_GROUP_TYPE_SUPPLIER,
  SUPPLIER_TYPE_ENUM,
} from './nats-client-vendor.response'

export class SupplierRelationRequest {
  supplierItems?: boolean
}

export class SupplierFilterRequest {
  id?: ConditionMongoId | string
  code?: ConditionString | string
  name?: ConditionString
  searchText?: string
  type?: SUPPLIER_TYPE_ENUM
  groupType?: ConditionNumber | SUPPLIER_GROUP_TYPE_SUPPLIER
}

export class SupplierSortRequest {
  id?: 'ASC' | 'DESC'
  code?: 'ASC' | 'DESC'
  name?: 'ASC' | 'DESC'
  type?: 'ASC' | 'DESC'
}

export class SupplierGetRequest {
  page?: number
  limit?: number
  relation?: SupplierRelationRequest
  filter?: SupplierFilterRequest
  sort?: SupplierSortRequest
}

export class SupplierPaginationRequest extends SupplierGetRequest {}
export class SupplierGetManyRequest extends OmitClass(SupplierGetRequest, [
  'page',
]) {}
export class SupplierGetOneRequest extends PickClass(SupplierGetRequest, [
  'filter',
  'relation',
]) {}

export class SupplierGetOneByIdRequest extends PickClass(SupplierGetRequest, [
  'relation',
]) {}
