import { FORMAT_CODE_PERMISSION, ACTIVE_ENUM } from '@constant/common';
export const ATTRIBUTE_GROUP_TEMPLATE_PERMISSION = {
  name: 'Quản lý nhóm thuộc tính',
  code: FORMAT_CODE_PERMISSION + 'ATTRIBUTE_GROUP',
  status: ACTIVE_ENUM.ACTIVE,
};

const STATUS = ACTIVE_ENUM.ACTIVE;
const GROUP = ATTRIBUTE_GROUP_TEMPLATE_PERMISSION.code;

export const CREATE_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_ATTRIBUTE_GROUP',
  name: 'Tạo nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_ATTRIBUTE_GROUP',
  name: 'Danh sách nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_ATTRIBUTE_GROUP',
  name: 'Chi tiết nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_ATTRIBUTE_GROUP',
  name: 'Sửa nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_STATUS_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_GROUP',
  name: 'Cập nhật trạng thái nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const CONFIRM_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_GROUP',
  name: 'Xác nhận nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const REJECT_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_GROUP',
  name: 'Từ chối  nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const ACTIVE_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_GROUP',
  name: 'Mở khoá nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const INACTIVE_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_ATTRIBUTE_GROUP',
  name: 'Khoá nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};
export const IMPORT_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_ATTRIBUTE_GROUP',
  name: 'Nhập nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const EXPORT_ATTRIBUTE_GROUP_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_ATTRIBUTE_GROUP',
  name: 'Xuất nhóm thuộc tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const ATTRIBUTE_GROUP_PERMISSION = [
  CREATE_ATTRIBUTE_GROUP_PERMISSION,
  UPDATE_ATTRIBUTE_GROUP_PERMISSION,
  UPDATE_STATUS_ATTRIBUTE_GROUP_PERMISSION,
  DETAIL_ATTRIBUTE_GROUP_PERMISSION,
  LIST_ATTRIBUTE_GROUP_PERMISSION,
  IMPORT_ATTRIBUTE_GROUP_PERMISSION,
  EXPORT_ATTRIBUTE_GROUP_PERMISSION,
  INACTIVE_ATTRIBUTE_GROUP_PERMISSION,
  ACTIVE_ATTRIBUTE_GROUP_PERMISSION,
  CONFIRM_ATTRIBUTE_GROUP_PERMISSION,
  REJECT_ATTRIBUTE_GROUP_PERMISSION,
];
