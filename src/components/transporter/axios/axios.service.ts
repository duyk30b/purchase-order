import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { catchError, lastValueFrom } from 'rxjs'

@Injectable()
export class AxiosService {
  private readonly logger = new Logger(AxiosService.name)
  constructor(private httpService: HttpService) {}

  async get(params: { url: string; config?: AxiosRequestConfig }) {
    const { url, config } = params

    const start = this.httpService.get(url, config).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw error
      })
    )

    const response = await lastValueFrom(start)
    return response.data
  }

  async post(params: {
    url: string
    data?: Record<string, any>
    config?: AxiosRequestConfig
  }) {
    const { url, data, config } = params

    const start = this.httpService.post(url, data, config).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw error
      })
    )

    const response = await lastValueFrom(start)
    return response.data
  }

  async put(params: {
    url: string
    data?: Record<string, any>
    config?: AxiosRequestConfig
  }) {
    const { url, data, config } = params

    const start = this.httpService.put(url, data, config).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw error
      })
    )

    const response = await lastValueFrom(start)
    return response.data
  }

  async patch(params: {
    url: string
    data?: Record<string, any>
    config?: AxiosRequestConfig
  }) {
    const { url, data, config } = params

    const start = this.httpService.patch(url, data, config).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw error
      })
    )

    const response = await lastValueFrom(start)
    return response.data
  }

  async delete(params: { url: string; config?: AxiosRequestConfig }) {
    const { url, config } = params

    const start = this.httpService.delete(url, config).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data)
        throw error
      })
    )

    const response = await lastValueFrom(start)
    return response.data
  }
}
