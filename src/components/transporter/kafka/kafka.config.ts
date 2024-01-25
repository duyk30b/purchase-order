import { KafkaOptions, Transport } from '@nestjs/microservices'
import 'dotenv/config'
import * as fs from 'fs'
import { Partitioners } from 'kafkajs'
import * as path from 'path'

export const KafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_INSTANCE_ID || 'purchase_order_service',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
      ssl: {
        rejectUnauthorized: false,
        ca: [
          fs.readFileSync(
            path.join(__dirname, '../../../cert/kafka.crt'),
            'utf-8'
          ),
        ],
        key: fs.readFileSync(
          path.join(__dirname, '../../../cert/kafka.key'),
          'utf-8'
        ),
        cert: fs.readFileSync(
          path.join(__dirname, '../../../cert/kafka.pem'),
          'utf-8'
        ),
      },
    },
    consumer: {
      groupId:
        'group-' + (process.env.KAFKA_INSTANCE_ID || 'purchase_order_service'),
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
      idempotent: true, // Mỗi tin nhắn được gửi chính xác 1 lần
      createPartitioner: Partitioners.LegacyPartitioner,
    },
    send: { acks: -1 }, // ack = -1 => "all": tất cả các replicas đều xác nhận đã ghi tin nhắn
  },
}

export const KafkaTopic = {
  REPORT: {
    PING: 'report_service.ping',
    SNAPSHOT_MIDNIGHT_ITEM_STOCK_DAILY:
      'report_service.snapshot_midnight_item_stock_daily',
    SNAPSHOT_MIDNIGHT_ITEM_MOVEMENT:
      'report_service.snapshot_midnight_item_movement',
    SNAPSHOT_REALTIME_ITEM_MOVEMENT:
      'report_service.snapshot_realtime_item_movement',
  },
  TICKET: {
    PING: 'ticket_service.ping',
    WAREHOUSE_IMPORT: {
      CONFIRM: 'ticket_service.warehouse_import.confirm',
      COMPLETE: 'ticket_service.warehouse_import.complete',
    },
    WAREHOUSE_EXPORT: {
      CONFIRM: 'ticket_service.warehouse_export.confirm',
      COMPLETE: 'ticket_service.warehouse_export.complete',
    },
    WAREHOUSE_TRANSFER: {
      CONFIRM: 'ticket_service.warehouse_transfer.confirm',
      COMPLETE: 'ticket_service.warehouse_transfer.complete',
    },
    WAREHOUSE_CHECKOUT: {
      CONFIRM: 'ticket_service.warehouse_checkout.confirm',
      COMPLETE: 'ticket_service.warehouse_checkout.complete',
    },
  },
  ITEM: {
    PING: 'item_service.ping',
    CREATE_ITEM: 'item_service.create_item',
    UPDATE_ITEM: 'item_service.update_item',
  },
}
