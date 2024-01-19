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
import { I18nTranslations } from 'src/generated/i18n.generated'

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current<I18nTranslations>()
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode || HttpStatus.OK,
        message: i18n.translate('common.SUCCESS'),
        data,
      }))
    )
  }
}
