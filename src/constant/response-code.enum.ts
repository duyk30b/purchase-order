import { ErrorMessageEnum } from './error-message.enum';

export enum ResponseCodeEnum {
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  CODE_EXIST = 1001,
  NOT_ACCEPTABLE = 406,
}

const CODE_MESSAGES = {
  NOT_FOUND: ErrorMessageEnum.NOT_FOUND,
  INTERNAL_SERVER_ERROR: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
  UNAUTHORIZED: ErrorMessageEnum.UNAUTHORIZED,
  FORBIDDEN: ErrorMessageEnum.FORBIDDEN,
  BAD_REQUEST: ErrorMessageEnum.BAD_REQUEST,
  SUCCESS: ErrorMessageEnum.SUCCESS,
  CODE_EXIST: ErrorMessageEnum.CODE_EXIST,
  NOT_ACCEPTABLE: ErrorMessageEnum.NOT_ACCEPTABLE,
};

export const getMessage = (code: ResponseCodeEnum): string => {
  return CODE_MESSAGES[ResponseCodeEnum[code]];
};
