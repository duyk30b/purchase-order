import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { AxiosError } from 'axios'
import * as FormData from 'form-data'
import { catchError, lastValueFrom } from 'rxjs'
import { GlobalConfig } from '../../../config/global.config'

@Injectable()
export class FileService {
  protected readonly urlConfig: string
  protected readonly resource = 'PURCHASE_ORDER'
  private readonly logger = new Logger(FileService.name)

  constructor(
    private httpService: HttpService,
    @Inject(GlobalConfig.KEY)
    private globalConfig: ConfigType<typeof GlobalConfig>
  ) {
    this.urlConfig = globalConfig.FILE_SERVICE.url
  }

  async uploadFiles(files: { filename: string; buffer: Buffer }[]) {
    const form = new FormData()
    form.append('service', this.globalConfig.SERVICE_NAME)
    form.append('resource', this.resource)
    files.forEach((file) => {
      form.append('files', file.buffer, {
        filename: file.filename,
      })
    })

    const start = this.httpService
      .post(`${this.urlConfig}/multiple-files`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': `Bearer ${this.globalConfig.INTERNAL_TOKEN}`,
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data)
          throw error
        })
      )

    const response = await lastValueFrom(start)
    const responseData = response.data as {
      status: number
      message: string
      data: string[] // List IdMongoDb of File
    }
    return responseData.data
  }

  async getFilesByIds(ids: string[]) {
    if (!ids.length) return []
    const start = this.httpService
      .get(`${this.urlConfig}/info?ids=${ids.toString()}`, {
        headers: {
          authorization: `Bearer ${this.globalConfig.INTERNAL_TOKEN}`,
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data)
          throw error
        })
      )

    const response = await lastValueFrom(start)
    const responseData = response.data as {
      status: number
      message: string
      data: { id: string; fileNameRaw: string; fileUrl: string }[]
    }
    return responseData.data
  }

  // File service chưa hỗ trợ API này
  // async deleteFileByIds(ids: string[]): Promise<any> {
  //   if (!ids.length) return []

  //   const start = this.httpService
  //     .delete(`${this.urlConfig}/multiple-files?ids=${ids.toString()}`, {
  //       headers: {
  //         authorization: `Bearer ${this.globalConfig.INTERNAL_TOKEN}`,
  //       },
  //     })
  //     .pipe(
  //       catchError((error: AxiosError) => {
  //         this.logger.error(error.response.data)
  //         throw error
  //       })
  //     )

  //   const response = await lastValueFrom(start)
  //   const responseData = response.data

  //   return responseData.data
  // }
}
