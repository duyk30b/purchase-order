import { PERMISSION_PREFIX, PERMISSION_STATUS } from './permission.constant'

export const PURCHASE_REQUEST_GROUP = {
  name: 'Quản lý yêu cầu mua hàng',
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_GROUP',
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_LIST = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_LIST',
  name: 'Danh sách yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_DETAIL = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_DETAIL',
  name: 'Chi tiết yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_CREATE = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_CREATE',
  name: 'Tạo yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_UPDATE = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_UPDATE',
  name: 'Sửa yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_PERMISSION = [
  PURCHASE_REQUEST_LIST,
  PURCHASE_REQUEST_CREATE,
  PURCHASE_REQUEST_UPDATE,
]
