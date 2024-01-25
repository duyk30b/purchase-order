export enum ExportFileType {
  EXCEL = 'EXCEL',
  WORD = 'WORD',
}

export const ExcelConfig = {
  MAX_ROWS_IN_SHEET: 1_000_000,
}

export const isDevMode = () => {
  return (
    process.env.NODE_ENV.startsWith('dev') ||
    process.env.NODE_ENV.startsWith('local')
  )
}
