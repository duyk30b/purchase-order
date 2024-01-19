import { PERMISSION_PREFIX, PERMISSION_STATUS } from './permission.constant'

export const PURCHASE_ORDER_GROUP = {
  name: 'Quản lý phiếu mua hàng',
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_GROUP',
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_LIST = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_LIST',
  name: 'Danh sách phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_INSERT = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_INSERT',
  name: 'Tạo phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_UPDATE = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_UPDATE',
  name: 'Sửa phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_PERMISSION = [
  PURCHASE_ORDER_LIST,
  PURCHASE_ORDER_INSERT,
  PURCHASE_ORDER_UPDATE,
]
