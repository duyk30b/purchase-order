import { CollationOptions } from 'mongodb';

export enum APIPrefix {
  Version = 'api/v1',
}

export const REGEX_FOR_FILTER =
  /[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ 0-9]/gi;

export const startCommandChars = '^XA';

export const endCommandChars = '^XZ';

export enum REPORT_TYPE_ENUM {
  DAY,
  WEEK,
  MONTH,
  QUARTER,
  YEAR,
}

export const DEFAULT_COLLATION: CollationOptions = {
  locale: 'vi',
};

export const SEPARATOR = ',';

export const MILLISECOND_TO_MINUTE = 1000 * 60;

export const DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';

export const DATE_FORMAT_NOTIFICATION = 'DD/MM/YYYY';

export const DATE_FORMAT_WITHOUT_HOUR = 'YYYY/MM/DD';

export const DATE_FORMAT_IMPORT = 'DD-MM-YYYY';

export const DATE_FORMAT_EXPORT = 'DD/MM/YYYY';

export const DATE_FORMAT_REGEX =
  /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;

export const DEFAULT_WARNING_SAFE_TIME = 2; // days

export const IT_DEPARTMENT_ID = 4;

export const FORMAT_CODE_PERMISSION = 'MMS_';

export const SUNDAY_DAY = 0;

export enum ACTIVE_ENUM {
  INACTIVE,
  ACTIVE,
}

export enum GET_ALL_ENUM {
  NO,
  YES,
}

export enum MIME_TYPE_IMAGE_ENUM {
  APNG = 'image/apng',
  AVIF = 'image/avif',
  GIF = 'image/gif',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  Web = 'image/webp',
  BMP = '	image/bmp',
}

export enum MIME_TYPE_OFFICE_ENUM {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export enum MIME_TYPE_TEXT_ENUM {
  TXT = 'text/plain',
  CSV = 'text/csv',
}

export const CODE_REGEX = /^[a-zA-Z0-9]+$/;

export enum STATUS_ENUM {
  WAITING_CONFIRM,
  CONFIRM,
  REJECT,
}

export enum REQUIRED_ENUM {
  REQUIRE,
  OPTIONAL,
}
export enum FIXED_ENUM_WITH_PARENT {
  UNFIXED,
  FIXED,
}
export enum DISPLAY_ENUM {
  SHOW,
  HIDDEN,
}
export enum UPDATE_ENUM {
  CAN_UPDATE,
  NOT_UPDATE,
}
export enum DATA_TYPE_ENUM {
  TEXT,
  CHECKBOX,
  DATE,
  SELECT_BOX_SINGLE,
  SELECT_BOX_MULTIPLE,
  NUMBER,
  RADIO,
}
export enum TEMPLATE_PARENT_ENUM {
  IMPORT = 0,
  EXPORT = 1,
  TRANSFER = 2,
  REQUEST_IMPORT = 3,
  REQUEST_EXPORT = 4,
  REQUEST_TRASFER = 5,
}

export enum AREA_ENUM_TEMPLATE {
  GENERAL = 0,
  DETAIL = 1,
}

export enum MODULE_ENUM {
  WMSX = 'WMSX',
  MESX = 'MESX',
  MMSX = 'MMSX',
  QMSX = 'QMSX',
}

export const MAX_FILE_SIZE = 5000000;
