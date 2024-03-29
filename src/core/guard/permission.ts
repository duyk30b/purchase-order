import {
  PURCHASE_ORDER_GROUP,
  PURCHASE_ORDER_PERMISSION,
} from './permission-purchase-order'
import {
  PURCHASE_REQUEST_GROUP,
  PURCHASE_REQUEST_PERMISSION,
} from './permission-purchase-request'

export const INSERT_PERMISSION = {
  permission: [...PURCHASE_REQUEST_PERMISSION, ...PURCHASE_ORDER_PERMISSION],
  groupPermission: [PURCHASE_REQUEST_GROUP, PURCHASE_ORDER_GROUP],
}
