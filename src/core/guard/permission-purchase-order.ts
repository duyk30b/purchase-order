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

export const PURCHASE_ORDER_DETAIL = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_DETAIL',
  name: 'Chi tiết phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_CREATE = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_CREATE',
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

export const PURCHASE_ORDER_WAIT_CONFIRM = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_WAIT_CONFIRM',
  name: 'Đề nghị duyệt phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_CONFIRM = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_CONFIRM',
  name: 'Xác nhận phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_REJECT = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_REJECT',
  name: 'Từ chối phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_CANCEL = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_CANCEL',
  name: 'Hủy phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_DELETE = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_DELETE',
  name: 'Xóa duyệt phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_HISTORY = {
  code: PERMISSION_PREFIX + 'PURCHASE_ORDER_HISTORY',
  name: 'Xem lịch sử phiếu mua hàng',
  groupPermissionSettingCode: PURCHASE_ORDER_GROUP.code,
  status: PERMISSION_STATUS.ACTIVE,
}

export const PURCHASE_ORDER_PERMISSION = [
  PURCHASE_ORDER_LIST,
  PURCHASE_ORDER_DETAIL,
  PURCHASE_ORDER_CREATE,
  PURCHASE_ORDER_UPDATE,
  PURCHASE_ORDER_WAIT_CONFIRM,
  PURCHASE_ORDER_CONFIRM,
  PURCHASE_ORDER_REJECT,
  PURCHASE_ORDER_CANCEL,
  PURCHASE_ORDER_DELETE,
  PURCHASE_ORDER_HISTORY,
]
