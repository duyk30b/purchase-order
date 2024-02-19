import { registerAs } from '@nestjs/config'

export const SyncDataSapConfig = registerAs('sync_data_sap', () => ({
  username: process.env.SAP_SYNC_USERNAME || 'AE-0000002',
  password: process.env.SAP_SYNC_PASSWORD || 'Snp12345678',
  syncItemGroupUri:
    process.env.SAP_SYNC_ITEM_GROUP_URI ||
    'static/wsdl/QueryProductCategories_350617.wsdl',
}))

export const SAP_SYNC_ITEM_GROUP_TIME =
  Number(process.env.SAP_SYNC_ITEM_GROUP_TIME) || 30 * 60 * 1000

export const SAP_SYNC_RETRY_NUMBER =
  Number(process.env.SAP_SYNC_RETRY_NUMBER) || 5
export const SAP_SYNC_RETRY_EACH_TIME =
  Number(process.env.SAP_SYNC_RETRY_EACH_TIME) || 5000
