import { OdataWarehouseImportType } from '../../../sync-data/odata-warehouse-import/odata-warehouse-import.type'

export interface IQueueMessage {
  data: Record<string, any>
  messageId: string
  createTime: string
}

export type IPingQueueMessage = IQueueMessage

export interface IRequestYn02Message extends OdataWarehouseImportType {
  groupKey: string
}
