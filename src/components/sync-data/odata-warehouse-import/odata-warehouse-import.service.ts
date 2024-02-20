import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Interval } from '@nestjs/schedule'
import { AxiosError } from 'axios'
import { catchError, lastValueFrom } from 'rxjs'
import {
  OdataWarehouseImportConfig,
  SAP_WAREHOUSE_IMPORT_INTERVAL,
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

  // @Interval(SAP_WAREHOUSE_IMPORT_INTERVAL)
  @Interval(10000)
  async start() {
    this.logger.debug('==== START SYNC WAREHOUSE IMPORT =======')
    const data = await this.getData({ top: 5, skip: 5 })
    console.log(
      '🚀 ~ OdataWarehouseImportService ~ start ~ data:',
      data.results
    )
  }

  async getData(options: { top: number; skip: number }) {
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
        _count: string // number nhưng để dạng string
        results: OdataWarehouseImportType[]
      }
    }
    return responseData.d
  }
}
