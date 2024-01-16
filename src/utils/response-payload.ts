import { ResponseCodeEnum } from '@constant/response-code.enum';

export interface ResponsePayload<T> {
  statusCode: ResponseCodeEnum;
  message?: string;
  data?: T;
}
