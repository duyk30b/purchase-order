import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { I18nPath, I18nTranslations } from 'src/generated/i18n.generated'

export type BaseResponse<T = any> = {
  data: T
  statusCode?: HttpStatus
  message?: I18nPath
  args?: any // arguments for I18n
}
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current<I18nTranslations>()
    return next.handle().pipe(
      map((response) => ({
        statusCode: response?.statusCode || HttpStatus.OK,
        message: i18n.translate(response?.message || 'common.SUCCESS', {
          args: response?.args || {},
        }),
        data: response?.data,
      }))
    )
  }
}
