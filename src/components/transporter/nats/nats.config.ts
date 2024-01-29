import { NatsOptions, Transport } from '@nestjs/microservices'
import 'dotenv/config'

export const NatsService = {
  VENDOR: process.env.NATS_VENDOR_SERVICE || 'vendor_service',
  AUTH: process.env.NATS_AUTH_SERVICE || 'auth_service',
  USER: process.env.NATS_USER_SERVICE || 'user_service',
  WEBHOOK: process.env.NATS_WEBHOOK_SERVICE || 'webhook_service',
  WAREHOUSE: process.env.NATS_WAREHOUSE || 'warehouse_service',
  WAREHOUSE_LAYOUT: process.env.NATS_WAREHOUSE || 'warehouse_layout_service',
  REPORT: process.env.NATS_REPORT_SERVICE || 'report_service',
  TICKET: process.env.NATS_TICKET_SERVICE || 'ticket_service',
  ITEM: process.env.NATS_ITEM_SERVICE || 'item_service',
  ATTRIBUTE: process.env.NATS_ATTRIBUTE_SERVICE || 'attribute_service',
  PRODUCE: process.env.NATS_PRODUCE_SERVICE || 'produce_service',
  COST_CENTER: process.env.NATS_COST_CENTER_SERVICE || 'cost_center_service',
  ITEM_STOCK_PLANNING:
    process.env.NATS_ITEM_STOCK_PLANNING_SERVICE ||
    'item_stock_planning_service',
  PURCHASE_ORDER:
    process.env.NATS_PURCHASE_ORDER_SERVICE || 'purchase_order_service',
}

export const NatsConfig: NatsOptions = {
  transport: Transport.NATS,
  options: {
    servers: process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222'],
    headers: { 'x-version': '1.0.0' },
    queue: NatsService.PURCHASE_ORDER,
  },
}

export const NatsSubject = {
  VENDOR: {
    SUPPLIER_GET_MANY: `${NatsService.VENDOR}.supplier_get_many`,
    SUPPLIER_GET_ONE: `${NatsService.VENDOR}.supplier_get_one`,
  },
  AUTH: {
    PING: NatsService.AUTH + '.ping',
    VALIDATE_TOKEN: NatsService.AUTH + '.validate_token',
  },
  USER: {
    PING: NatsService.USER + '.ping',
    DETAIL: NatsService.USER + '.detail',
    INSERT_PERMISSION: NatsService.USER + '.insert_permission',
    DELETE_PERMISSION_NOT_ACTIVE:
      NatsService.USER + '.delete_permission_not_active',
  },
  REPORT: {
    PING: NatsService.REPORT + '.ping',
    SNAPSHOT_ITEMS: NatsService.REPORT + '.snapshot_items',
    SNAPSHOT_ITEM_MOVEMENT: NatsService.REPORT + '.snapshot_item_movement',
  },
  WAREHOUSE: {
    PING: NatsService.WAREHOUSE + '.ping',
    GET_WAREHOUSES: NatsService.WAREHOUSE + '.get_warehouses',
  },
  WAREHOUSE_LAYOUT: {
    PING: NatsService.WAREHOUSE_LAYOUT + '.ping',
    GET_LOCATORS: NatsService.WAREHOUSE_LAYOUT + '.get_locators',
  },
  TICKET: {
    PING: NatsService.TICKET + '.ping',
    GET_WAREHOUSE_IMPORT_LIST:
      NatsService.TICKET + '.get_warehouse_import_list',
    GET_WAREHOUSE_EXPORT_LIST:
      NatsService.TICKET + '.get_warehouse_export_list',
    GET_WAREHOUSE_TRANSFER_LIST:
      NatsService.TICKET + '.get_warehouse_transfer_list',
    GET_WAREHOUSE_CHECKOUT_LIST:
      NatsService.TICKET + '.get_warehouse_checkout_list',
  },
  ITEM: {
    PING: NatsService.ITEM + '.ping',
    GET_ITEMS_REPORT: NatsService.ITEM + '.get_items_report',
    GET_ITEMS_BY_IDS: NatsService.ITEM + '.get_items_by_ids',
    STOCK_MOVEMENT: NatsService.ITEM + '.stock_movement',
  },
  WEBHOOK: {
    PING: NatsService.WEBHOOK + '.ping',
    REGISTER_EVENT: NatsService.WEBHOOK + '.register_event',
  },
  ATTRIBUTE: {
    PING: NatsService.ATTRIBUTE + '.ping',
    GET_TEMPLATES_BY_IDS: NatsService.ATTRIBUTE + '.get_templates_by_ids',
  },
  PURCHASE_ORDER: {
    GET_PURCHASED_ORDER_LIST:
      NatsService.PURCHASE_ORDER + '.get_purchase_order_list',
  },
}
