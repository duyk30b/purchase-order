import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
  ValidationError,
} from '@nestjs/common'
import { KafkaContext, NatsContext } from '@nestjs/microservices'
import { ThrottlerException } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { from } from 'rxjs'
import * as url from 'url'
import { isDevMode } from '../../common/constants/variable'
import { I18nPath, I18nTranslations } from '../../generated/i18n.generated'

export class ValidationException extends Error {
  public errors: ValidationError[]
  constructor(validationErrors: ValidationError[] = []) {
    super('Validate Failed')
    this.errors = validationErrors
  }
}

export class BusinessException extends Error {
  public statusCode: HttpStatus
  public i18args?: Record<string, any>
  public errors: any[] | Record<string, any>

  constructor(
    message: I18nPath,
    i18args = {}, // biến khai báo cho i18n
    statusCode = HttpStatus.BAD_REQUEST
  ) {
    super(message)
    this.statusCode = statusCode
    this.i18args = i18args
  }

  static msg(message: I18nPath, i18args = {}) {
    return new BusinessException(message, i18args, HttpStatus.BAD_REQUEST)
  }

  static error(options: {
    message: I18nPath
    i18args?: Record<string, any>
    error?: Record<string, any>
  }) {
    const exception = new BusinessException(
      options.message,
      options.i18args,
      HttpStatus.BAD_REQUEST
    )
    exception.errors = options.error || {}
    return exception
  }
}

@Catch(Error)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let { message } = exception
    const { stack } = exception
    const errors: any[] = (exception as any).errors || []

    switch (exception['constructor'].name) {
      case ValidationException.name: {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY
        break
      }
      case BusinessException.name: {
        const i18n = I18nContext.current<I18nTranslations>(host)
        message = i18n.translate(exception.message as any, {
          args: (exception as BusinessException)?.i18args,
        })
        statusCode = (exception as BusinessException).statusCode
        break
      }
      case ThrottlerException.name: {
        statusCode = HttpStatus.TOO_MANY_REQUESTS
        break
      }
      case ValidationException.name: {
        statusCode = HttpStatus.NOT_FOUND
        break
      }
      default: {
        const i18n = I18nContext.current<I18nTranslations>(host)
        message = isDevMode()
          ? exception.message
          : i18n.translate('error.INTERNAL_SERVER_ERROR')
      }
    }

    const [req, res] = host.getArgs()

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()

      const { originalUrl, method, body } = request
      const urlParse = url.parse(originalUrl, true)
      const urlPath = urlParse.pathname
      const urlQuery = urlParse.query
      Logger.error(
        JSON.stringify({
          message: exception.message,
          messageI18n: message,
          type: '[HTTP]',
          method,
          path: urlPath,
          query: urlQuery,
          errors,
          body,
          external: (request as any).external,
        }),
        exception.name
      )
      response.status(statusCode).send({
        statusCode,
        errors,
        message,
        path: originalUrl,
      })
    } else if (host.getType() === 'rpc') {
      if (res.constructor.name === 'NatsContext') {
        // const response = host.switchToRpc().getContext<NatsContext>()
        const response: NatsContext = res
        const info: Record<string, any> = {
          statusCode,
          message,
          errors,
          details: {
            subject: response.getSubject(),
            request: req,
            stack,
          },
        }
        return from([info])
      } else if (res.constructor.name === 'KafkaContext') {
        // const response = host.switchToRpc().getContext<KafkaContext>()
        const response: KafkaContext = res
        const info: Record<string, any> = {
          statusCode,
          message,
          errors,
          details: {
            topic: response.getTopic(),
            partition: response.getPartition(),
            offset: response.getMessage().offset,
            request: req,
          },
        }
        return from([info])
      }
    }
  }
}
