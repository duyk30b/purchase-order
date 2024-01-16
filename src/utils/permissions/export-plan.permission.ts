import { FORMAT_CODE_PERMISSION, ACTIVE_ENUM } from '@constant/common';
export const EXPORT_PLAN_TEMPLATE_PERMISSION = {
  name: 'Quản lý kế hoạch xuất hàng',
  code: FORMAT_CODE_PERMISSION + 'EXPORT_PLAN',
  status: ACTIVE_ENUM.ACTIVE,
};

const STATUS = ACTIVE_ENUM.ACTIVE;
const GROUP = EXPORT_PLAN_TEMPLATE_PERMISSION.code;

export const CREATE_EXPORT_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_EXPORT_PLAN',
  name: 'Tạo kế hoạch xuất hàng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const LIST_EXPORT_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_EXPORT_PLAN',
  name: 'Danh sách kế hoạch xuất hàng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DETAIL_EXPORT_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_EXPORT_PLAN',
  name: 'Chi tiết kế hoạch xuất hàng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const UPDATE_EXPORT_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_EXPORT_PLAN',
  name: 'Cập nhật kế hoạch xuất hàng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const DELETE_EXPORT_PLAN_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_EXPORT_PLAN',
  name: 'Xóa kế hoạch xuất hàng',
  groupPermissionSettingCode: GROUP,
  status: STATUS,
};

export const EXPORT_PLAN_PERMISSION = [
  CREATE_EXPORT_PLAN_PERMISSION,
  LIST_EXPORT_PLAN_PERMISSION,
  DETAIL_EXPORT_PLAN_PERMISSION,
  UPDATE_EXPORT_PLAN_PERMISSION,
  DELETE_EXPORT_PLAN_PERMISSION,
];
