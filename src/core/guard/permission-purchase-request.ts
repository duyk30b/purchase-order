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

export const PURCHASE_REQUEST_WAIT_CONFIRM = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_WAIT_CONFIRM',
  name: 'Đề nghị duyệt yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_CONFIRM = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_CONFIRM',
  name: 'Xác nhận yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_REJECT = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_REJECT',
  name: 'Từ chối yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_CANCEL = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_CANCEL',
  name: 'Hủy yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_DELETE = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_DELETE',
  name: 'Xóa duyệt yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_HISTORY = {
  code: PERMISSION_PREFIX + 'PURCHASE_REQUEST_HISTORY',
  name: 'Xem lịch sử yêu cầu mua hàng',
  groupPermissionSettingCode: PURCHASE_REQUEST_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_REQUEST_PERMISSION = [
  PURCHASE_REQUEST_LIST,
  PURCHASE_REQUEST_DETAIL,
  PURCHASE_REQUEST_CREATE,
  PURCHASE_REQUEST_UPDATE,
  PURCHASE_REQUEST_WAIT_CONFIRM,
  PURCHASE_REQUEST_CONFIRM,
  PURCHASE_REQUEST_REJECT,
  PURCHASE_REQUEST_CANCEL,
  PURCHASE_REQUEST_DELETE,
  PURCHASE_REQUEST_HISTORY,
]
