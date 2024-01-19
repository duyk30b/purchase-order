import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { KafkaContext, NatsContext } from '@nestjs/microservices'
import { Request } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import * as url from 'url'
import { ValidationException } from '../exception-filter/exception-filter'

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  private logger = new Logger('AccessLogInterceptor')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const createTime = new Date()
    const className = context.getClass().name
    const funcName = context.getHandler().name
    const [req, res] = context.getArgs()

    const showData = true
    const message: Record<string, any> = {}

    if (context.getType() === 'http') {
      const ctx = context.switchToHttp()
      const request: Request = ctx.getRequest()
      const { originalUrl, method, body } = request
      const urlParse = url.parse(originalUrl, true)
      const urlPath = urlParse.pathname
      const urlQuery = urlParse.query

      if (urlPath?.includes('purchase-order/health')) return next.handle()

      message.type = '[API]'
      message.method = method
      message.path = urlPath
      message.query = urlQuery
      message.className = className
      message.funcName = funcName
      message.external = {
        user: { id: request['external']?.user?.id },
      }
      if (showData) {
        message.body = body
      }
    } else if (context.getType() === 'rpc') {
      if (res.constructor.name === 'NatsContext') {
        const response: NatsContext = res
        message.type = '[NATS]'
        message.subject = response.getSubject()
        message.className = className
        message.funcName = funcName
        if (showData) {
          message.request = req
        }
      }
      if (res.constructor.name === 'KafkaContext') {
        const response: KafkaContext = res
        message.type = '[KAFKA]'
        message.topic = response.getTopic()
        message.partition = response.getPartition()
        message.offset = response.getMessage().offset
        message.className = className
        message.funcName = funcName
        if (showData) {
          message.request = req
        }
      }
    }

    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof ValidationException) {
          message.validate = err.errors
        }
        message.message = err.message
        message.time = `${Date.now() - createTime.getTime()}ms`
        this.logger.error(JSON.stringify(message))
        return throwError(() => err)
      }),
      tap((xx: any) => {
        message.time = `${Date.now() - createTime.getTime()}ms`
        this.logger.log(JSON.stringify(message))
      })
    )
  }
}
