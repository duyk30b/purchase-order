import { sleep } from '@nestcloud/common'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Client } from 'nestjs-soap'
import {
  SAP_SYNC_RETRY_EACH_TIME,
  SAP_SYNC_RETRY_NUMBER,
} from '../sync-data-sap.config'
import { ProductCategorySapType } from './product-category-sap.type'

@Injectable()
export class SoapItemGroupService {
  private readonly logger = new Logger(SoapItemGroupService.name)

  constructor(
    @Inject('SOAP_ITEM_GROUP_SERVICE') private readonly soapClient: Client
  ) {}

  async getAll() {
    this.logger.debug('Start fetch "ProductCategory" from SAP')

    for (let i = 0; i <= SAP_SYNC_RETRY_NUMBER; i++) {
      try {
        const response: ProductCategorySapType = await new Promise(
          (resolve, reject) => {
            this.soapClient.FindByElements(
              {},
              (err: any, result: any, rawResponse, soapHeader, rawRequest) => {
                if (err) reject(err)
                else resolve(result)
              }
            )
          }
        )

        const itemGroupResponse: { code: string; name: string }[] = []
        response.ProductCategoryHierarchy.forEach((i) => {
          i.ProductCategory.forEach((j) => {
            itemGroupResponse.push({
              code: j.ProductCategoryInternalID,
              name:
                j.ProductCategoryDescription?.[0]?.Description?.$value || '',
            })
          })
        })

        return itemGroupResponse
      } catch (error: any) {
        console.log('🚀 ~ SoapItemGroupService ~ getAll ~ error:', error)
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
          await sleep(i * SAP_SYNC_RETRY_EACH_TIME)
          this.logger.debug(`Start retry, number of retries = ${i}`)
        }
      }
    }

    throw new Error('Fetch "ProductCategory" from SAP failed !!!')
  }
}
