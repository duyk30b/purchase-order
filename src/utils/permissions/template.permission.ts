import { FORMAT_CODE_PERMISSION, ACTIVE_ENUM } from '@constant/common';
export const TEMPLATE_GROUP_PERMISSION = {
  name: 'Quản lý bản mẫu',
  code: FORMAT_CODE_PERMISSION + 'TEMPLATE_GROUP',
  status: ACTIVE_ENUM.ACTIVE,
};

const STATUS = ACTIVE_ENUM.ACTIVE;
const GROUP = TEMPLATE_GROUP_PERMISSION.code;

export const CREATE_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_TEMPLATE',
  name: 'Tạo bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_TEMPLATE',
  name: 'Danh sách bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_TEMPLATE',
  name: 'Chi tiết bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_TEMPLATE',
  name: 'Sửa bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_STATUS_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_TEMPLATE',
  name: 'Cập nhật trạng thái bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const CONFIRM_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_TEMPLATE',
  name: 'Xác nhận bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const REJECT_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_TEMPLATE_',
  name: 'Từ chối  bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const ACTIVE_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_TEMPLATE',
  name: 'Mở khoá bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const INACTIVE_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_TEMPLATE',
  name: 'Khoá bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const DELETE_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_TEMPLATE',
  name: 'Xoá bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const IMPORT_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_TEMPLATE',
  name: 'Nhập bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const EXPORT_TEMPLATE_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_TEMPLATE',
  name: 'Xuất bản mẫu',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const TEMPLATE_PERMISSION = [
  CREATE_TEMPLATE_PERMISSION,
  UPDATE_TEMPLATE_PERMISSION,
  UPDATE_STATUS_TEMPLATE_PERMISSION,
  DETAIL_TEMPLATE_PERMISSION,
  LIST_TEMPLATE_PERMISSION,
  IMPORT_TEMPLATE_PERMISSION,
  EXPORT_TEMPLATE_PERMISSION,
  INACTIVE_TEMPLATE_PERMISSION,
  ACTIVE_TEMPLATE_PERMISSION,
  CONFIRM_TEMPLATE_PERMISSION,
  REJECT_TEMPLATE_PERMISSION,
  DELETE_TEMPLATE_PERMISSION,
];
