import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.getArgByIndex(0);

    if (request.url !== '/api/v1/mms/health') {
      console.info('Before...');
      console.info('url: ', request?.url);
      console.info('body: ', request?.body);
    }

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        if (request.url !== '/api/v1/mms/health') {
          console.info('Response: ', data);
          console.info(`After... ${Date.now() - now}ms`);
        }
      }),
    );
  }
}
