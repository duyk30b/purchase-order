import { FORMAT_CODE_PERMISSION, ACTIVE_ENUM } from '@constant/common';

export const UNIT_GROUP_PERMISSION = {
  name: 'Quản lý đơn vị tính',
  code: FORMAT_CODE_PERMISSION + 'UNIT_GROUP',
  status: ACTIVE_ENUM.ACTIVE,
};

const STATUS = ACTIVE_ENUM.ACTIVE;
const GROUP = UNIT_GROUP_PERMISSION.code;

export const CREATE_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_UNIT',
  name: 'Tạo đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_UNIT',
  name: 'Danh sách đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_UNIT',
  name: 'Chi tiết đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_UNIT',
  name: 'Sửa đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_STATUS_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_STATUS_UNIT',
  name: 'Cập nhật trạng thái đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const IMPORT_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_UNIT',
  name: 'Nhập đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const EXPORT_UNIT_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_UNIT',
  name: 'Xuất đơn vị tính',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UNIT_PERMISSION = [
  CREATE_UNIT_PERMISSION,
  UPDATE_UNIT_PERMISSION,
  UPDATE_STATUS_UNIT_PERMISSION,
  DETAIL_UNIT_PERMISSION,
  LIST_UNIT_PERMISSION,
  IMPORT_UNIT_PERMISSION,
  EXPORT_UNIT_PERMISSION,
];
