import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { AxiosError } from 'axios'
import { catchError, lastValueFrom } from 'rxjs'
import { sleep } from '../../../common/helpers'
import {
  OdataWarehouseImportConfig,
  SAP_WAREHOUSE_IMPORT_RETRY_EACH_TIME,
  SAP_WAREHOUSE_IMPORT_RETRY_NUMBER,
} from './odata-warehouse-import.config'
import { OdataWarehouseImportType } from './odata-warehouse-import.type'

@Injectable()
export class OdataWarehouseImportService {
  private readonly logger = new Logger(OdataWarehouseImportService.name)

  constructor(
    @Inject(OdataWarehouseImportConfig.KEY)
    private owiConfig: ConfigType<typeof OdataWarehouseImportConfig>,
    private readonly httpService: HttpService
  ) {}

  async getData(options: { top: number; skip: number }) {
    this.logger.debug('Start fetch "WarehouseImport" from SAP')

    for (let i = 0; i <= SAP_WAREHOUSE_IMPORT_RETRY_NUMBER; i++) {
      try {
        const { top, skip } = options
        const authBuffer = Buffer.from(
          `${this.owiConfig.username}:${this.owiConfig.password}`
        ).toString('base64')

        const start = this.httpService
          .get(this.owiConfig.warehouseImportUri, {
            headers: { Authorization: `Basic ${authBuffer}` },
            params: {
              $top: top,
              $skip: skip,
              $format: 'json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.message)
              throw error
            })
          )

        const response = await lastValueFrom(start)
        const responseData = response.data as {
          d: {
            __count: string // number nhưng để dạng string
            results: OdataWarehouseImportType[]
          }
        }
        return responseData.d
      } catch (error: any) {
        // lỗi authenticate thì dừng lại luôn
        if (error.response?.status === 401) {
          const errorMessage = JSON.stringify({
            status: 401,
            message: error.response.statusText,
          })
          this.logger.error(errorMessage)
          throw new Error(errorMessage) // === STOP tại đây thôi ====
        }
        // các lỗi khác (NETWORK, TIMEOUT, ...) thì cho retry
        else {
          this.logger.error(error.message)
          await sleep(i * SAP_WAREHOUSE_IMPORT_RETRY_EACH_TIME)
          this.logger.debug(`Start retry, number of retries = ${i}`)
        }
      }
    }

    throw new Error('Start fetch "WarehouseImport" from SAP failed !!!')
  }
}
