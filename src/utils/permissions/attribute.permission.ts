import { FORMAT_CODE_PERMISSION, ACTIVE_ENUM } from '@constant/common';
export const ATTRIBUTE_TEMPLATE_PERMISSION = {
  name: 'Quản lý thuộc tính',
  code: FORMAT_CODE_PERMISSION + 'ATTRIBUTE_TEMPLATE',
  status: ACTIVE_ENUM.ACTIVE,
};

const STATUS = ACTIVE_ENUM.ACTIVE;
const GROUP = ATTRIBUTE_TEMPLATE_PERMISSION.code;

export const CREATE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_ATTRIBUTE',
  name: 'Tạo thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_ATTRIBUTE',
  name: 'Danh sách thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_ATTRIBUTE_GROUP',
  name: 'Chi tiết thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_ATTRIBUTE',
  name: 'Sửa thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_STATUS_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE',
  name: 'Cập nhật trạng thái thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const CONFIRM_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE',
  name: 'Xác nhận thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const REJECT_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_',
  name: 'Từ chối  thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const ACTIVE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE',
  name: 'Mở khoá thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const INACTIVE_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE',
  name: 'Khoá thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const IMPORT_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_ATTRIBUTE',
  name: 'Nhập thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const EXPORT_ATTRIBUTE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_ATTRIBUTE',
  name: 'Xuất thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const ATTRIBUTE_PERMISSION = [
  CREATE_ATTRIBUTE_PERMISSION,
  UPDATE_ATTRIBUTE_PERMISSION,
  UPDATE_STATUS_ATTRIBUTE_PERMISSION,
  DETAIL_ATTRIBUTE_PERMISSION,
  LIST_ATTRIBUTE_PERMISSION,
  IMPORT_ATTRIBUTE_PERMISSION,
  EXPORT_ATTRIBUTE_PERMISSION,
  INACTIVE_ATTRIBUTE_PERMISSION,
  ACTIVE_ATTRIBUTE_PERMISSION,
  CONFIRM_ATTRIBUTE_PERMISSION,
  REJECT_ATTRIBUTE_PERMISSION,
];
