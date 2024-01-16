import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Expose } from 'class-transformer';
import { ResponsePayload } from './response-payload';

export class ResponseService implements ResponsePayload<object> {
  @Expose()
  statusCode: ResponseCodeEnum;

  @Expose()
  message?: string;

  @Expose()
  data?: object;
}
