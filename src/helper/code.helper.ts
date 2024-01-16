import { CODE_DEFAULT } from '@utils/constant';
import * as moment from 'moment';

export const characterPrefix = '__';

export function generateCode(
  latestObj: any,
  defaultCode: string,
  maxLength: number,
  padChar: string,
  gap = 1,
): string {
  let generatedCode;
  if (latestObj) generatedCode = (+latestObj.code + gap).toString();
  else generatedCode = defaultCode;

  return generatedCode.padStart(maxLength, padChar);
}

export function generatedCode(latestObj: any, constant: any, gap = 1): string {
  let generatedCode;

  if (latestObj)
    generatedCode = (Number.parseInt(latestObj.code) + gap).toString();
  else generatedCode = constant.DEFAULT_CODE;

  return generatedCode.padStart(constant.MAX_LENGTH - 1, constant.PAD_CHAR);
}

export function generateCodeByPreviousCode(
  prefix: string,
  currentCode: number,
  maxLength = CODE_DEFAULT.CODE_LENGTH,
  gap = CODE_DEFAULT.GAP,
  padChar = CODE_DEFAULT.PAD_CHAR,
): string {
  return prefix.concat(
    (currentCode + gap).toString().padStart(maxLength, padChar),
  );
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCurrentCodeByLastRecord(codePrefix = '', lastRecord) {
  return +lastRecord.code?.replace(codePrefix, '') || 0;
}

export function generateItemWarehouseLocator(item: any) {
  return [
    item.itemId,
    item?.locatorId || item?.ticketLocatorId || '',
    item?.lot?.toUpperCase() || item?.lotNumber?.toUpperCase() || '',
    moment(item?.mfg || item?.mfgDate || undefined).format('DD/MM/YYYY'),
    item?.warehouseId || '',
    item?.unitId || '',
    item?.level || '',
  ].join(characterPrefix);
}
