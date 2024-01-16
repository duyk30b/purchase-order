export const FileResource = {
  EXPORT_PLAN: 'EXPORT_PLAN',
};

export const UPLOAD_FILE_ENPOINT = {
  MULTIPLE: 'files/multiple-files',
  SINGLE: 'files/single-file',
  INFO: 'files/info',
};

export const MIMETYPE_FILE_UPLOAD = [
  'application/pdf',
  'image/png',
  'image/jpeg',
];

export const MAX_SIZE_FILE_UPLOAD = {
  EXPORT_PLAN: 5 * 1024 * 1024,
  BASE: 4 * 1024 * 1024,
  SO: 4 * 1024 * 1024,
  IMPORT: 2 * 1024 * 1024,
};
