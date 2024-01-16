import { APIPrefix } from '@constant/common';

export const FileResource = {
  BOM: 'BOM',
  PRODUCING_STEP: 'PRODUCING_STEP',
  MANUFACTURING_ORDER: 'MO',
  STAGE_TRANSFER_ADJUSTMENT: 'STAGE_TRANSFER_ADJUSTMENT',
  RETURN_ITEM_ORDER: 'RETURN_ITEM_ORDER',
  MOLD: 'MOLD',
};

export const UPLOAD_FILE_ENPOINT = {
  MULTIPLE: 'files/multiple-files',
  SINGLE: 'files/single-file',
  INFO: 'files/info',
};

export const MIMETYPE_FILE_UPLOAD_EXPORT_PLAN = [
  'application/pdf',
  'image/png',
  'image/jpeg',
];

export const MAX_SIZE_FILE_UPLOAD = {
  SIZE: 4 * 1024 * 1024,
};
