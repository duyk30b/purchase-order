import { OmitClass, PickClass } from '../../../../common/helpers'

export class PurchaseInvoiceRelationRequest {
  purchasedInvoiceItems?: boolean
}

export class PurchaseInvoiceFilterRequest {
  id?: string
  poCode?: string
}

export class PurchaseInvoiceSortRequest {
  id?: 'ASC' | 'DESC'
}

export class PurchaseInvoiceGetRequest {
  page?: number
  limit?: number
  relation?: PurchaseInvoiceRelationRequest
  filter?: PurchaseInvoiceFilterRequest
  sort?: PurchaseInvoiceSortRequest
}

export class PurchaseInvoicePaginationRequest extends PurchaseInvoiceGetRequest {}
export class PurchaseInvoiceGetManyRequest extends OmitClass(
  PurchaseInvoiceGetRequest,
  ['page']
) {}
export class PurchaseInvoiceGetOneRequest extends PickClass(
  PurchaseInvoiceGetRequest,
  ['filter', 'relation', 'sort']
) {}

export class PurchaseInvoiceGetOneByIdRequest extends PickClass(
  PurchaseInvoiceGetRequest,
  ['relation']
) {}
