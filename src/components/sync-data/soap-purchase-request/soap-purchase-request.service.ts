import { sleep } from '@nestcloud/common'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Client } from 'nestjs-soap'
import {
  SAP_PURCHASE_REQUEST_RETRY_EACH_TIME,
  SAP_PURCHASE_REQUEST_RETRY_NUMBER,
} from './soap-purchase-request.config'
import { SoapPurchaseRequestType } from './soap-purchase-request.type'

@Injectable()
export class SoapPurchaseRequestService {
  private readonly logger = new Logger(SoapPurchaseRequestService.name)

  constructor(
    @Inject('SOAP_PURCHASE_REQUEST_SERVICE') private readonly soapClient: Client
  ) {}

  async test() {
    this.logger.debug('Start Post "PurchaseRequest" to SAP')

    for (let i = 0; i <= SAP_PURCHASE_REQUEST_RETRY_NUMBER; i++) {
      try {
        const response: SoapPurchaseRequestType = await new Promise(
          (resolve, reject) => {
            this.soapClient.MaintainBundle(
              {},
              (err: any, result: any, rawResponse, soapHeader, rawRequest) => {
                if (err) reject(err)
                else resolve(result)
              }
            )
          }
        )

        const itemGroupResponse: { code: string; name: string }[] = []

        return itemGroupResponse
      } catch (error: any) {
        console.log('🚀 ~ SoapPurchaseRequestService ~ getAll ~ error:', error)
        // lỗi authenticate thì dừng lại luôn
        if (error.response?.status === 401) {
          const errorMessage = JSON.stringify({
            status: 401,
            message: error.response.statusText,
          })
          this.logger.error(errorMessage)
          throw new Error(errorMessage)
        }
        // các lỗi khác (NETWORK, TIMEOUT, ...) thì cho retry
        else {
          this.logger.error(error.message)
          await sleep(i * SAP_PURCHASE_REQUEST_RETRY_EACH_TIME)
          this.logger.debug(`Start retry, number of retries = ${i}`)
        }
      }
    }

    throw new Error('Post "PurchaseRequest" to SAP failed !!!')
  }
}
