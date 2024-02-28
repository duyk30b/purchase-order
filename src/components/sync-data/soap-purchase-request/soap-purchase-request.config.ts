import { registerAs } from '@nestjs/config'

export const SoapPurchaseRequestConfig = registerAs(
  'soap_purchase_request',
  () => ({
    username: process.env.SAP_USERNAME || '_TEST_USER',
    password: process.env.SAP_PASSWORD || 'Welcome1',
    syncPurchaseRequestUri:
      process.env.SAP_PURCHASE_REQUEST_URI ||
      'static/wsdl/ManagePurchaseRequestIn_350617.wsdl',
  })
)

export const SAP_PURCHASE_REQUEST_RETRY_NUMBER =
  Number(process.env.SAP_PURCHASE_REQUEST_RETRY_NUMBER) || 2
export const SAP_PURCHASE_REQUEST_RETRY_EACH_TIME =
  Number(process.env.SAP_PURCHASE_REQUEST_RETRY_EACH_TIME) || 5000
