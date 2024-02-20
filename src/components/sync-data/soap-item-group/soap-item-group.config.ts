import { registerAs } from '@nestjs/config'

export const SoapItemGroupConfig = registerAs('soap_item_group', () => ({
  username: process.env.SAP_USERNAME || 'AE-0000002',
  password: process.env.SAP_PASSWORD || 'Snp12345678',
  syncItemGroupUri:
    process.env.SAP_ITEM_GROUP_URI ||
    'static/wsdl/QueryProductCategories_350617.wsdl',
}))

export const SAP_ITEM_GROUP_INTERVAL =
  Number(process.env.SAP_ITEM_GROUP_INTERVAL) || 30 * 60 * 1000

export const SAP_ITEM_GROUP_RETRY_NUMBER =
  Number(process.env.SAP_ITEM_GROUP_RETRY_NUMBER) || 5
export const SAP_ITEM_GROUP_RETRY_EACH_TIME =
  Number(process.env.SAP_ITEM_GROUP_RETRY_EACH_TIME) || 5000
