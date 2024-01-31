export enum SUPPLIER_TYPE_ENUM {
  ENTERPRISE = 1,
  HOUSEHOLD_BUSINESS = 2,
  OTHER = 3,
}

export enum SUPPLIER_GROUP_TYPE_SUPPLIER {
  MATERIAL = 1,
  SERVICE_PRODUCT = 2,
  PROCESSING_SERVICE = 3,
  OTHER = 4,
}

export enum SUPPLIER_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export type SupplierItemType = {
  supplierId: string
  itemId: number
  itemUnitId: number
  deliveryTerm: number
  price: string
  description: string
}

export type SupplierType = {
  id: string
  code: string
  name: string
  type: SUPPLIER_TYPE_ENUM
  groupType: SUPPLIER_GROUP_TYPE_SUPPLIER
  abbreviation: string //tên viết tắt
  taxCode: string
  representor: string
  phone: string
  countryId: number
  paymentCurrencyId: number
  location: string
  email: string
  fax: string
  avatars: string[]
  status: SUPPLIER_STATUS
  supplierItems?: SupplierItemType[]
}
