export interface IQueueMessage {
  data: Record<string, any>
  messageId: string
  createTime: string
}

export type IPingQueueMessage = IQueueMessage

export interface IItemStockMovementMessage extends IQueueMessage {
  groupKey: string
}
