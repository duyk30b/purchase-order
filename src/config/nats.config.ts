import { registerAs } from '@nestjs/config';
import 'dotenv/config';

import { NatsOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';

export const NatsService = {
  AUTH: process.env.NATS_AUTH_SERVICE || 'auth_service',
  USER: process.env.NATS_USER_SERVICE || 'user_service',
  WEBHOOK: process.env.NATS_WEBHOOK_SERVICE || 'webhook_service',
  WAREHOUSE: process.env.NATS_WAREHOUSE || 'warehouse_service',
  PRODUCE: process.env.NATS_PRODUCE || 'produce_service',
  FILE_WATCHER: process.env.NATS_FILE_WATCHER_SERVICE || 'file_watcher_service',
  ITEM: process.env.NATS_ITEM_SERVICE || 'item_service',
  SALE: process.env.NATS_SALE_SERVICE || 'sale_service',
  ITEM_STOCK_PLANNING:
    process.env.NATS_ITEM_STOCK_PLANNING_SERVICE ||
    'item_stock_planning_service',
  SALE_ORDER_INSTRUCTION_SERVICE:
    process.env.NATS_SALE_ORDER_INSTRUCTION_SERVICE ||
    'sale_order_instruction_service',
  COST_CENTER: process.env.NATS_COST_CENTER_SERVICE || 'cost_center_service',
};

export const NatsConfig: NatsOptions = {
  transport: Transport.NATS,
  options: {
    servers: process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222'],
    headers: { 'x-version': '1.0.0' },
    queue: NatsService.WEBHOOK,
  },
};
