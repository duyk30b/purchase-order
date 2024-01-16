import { plus } from '@utils/helper';
import { has } from 'lodash';
import { generateCodeByPreviousCode } from './code.helper';

export function getDataInsert(
  data: any[],
  codePrefix = '',
  codeCurrent = 0,
  textAdd = 'add',
) {
  const dataInsert = [];
  data.forEach((item, index) => {
    if (item.action === textAdd) {
      item.code = generateCodeByPreviousCode(
        codePrefix,
        plus(codeCurrent, index),
      );
      dataInsert.push(item);
    }
  });
  return dataInsert;
}

export function getDataUpdate(data: any[], textAdd = 'add') {
  const dataToUpdate = [];
  const codesUpdate = [];
  data.forEach((item) => {
    if (item.action !== textAdd) {
      dataToUpdate.push(item);
      codesUpdate.push(item.code);
    }
  });
  return { dataToUpdate, codesUpdate };
}

export function getDataToUpdateError(data: any[], dataCodeMap = {}) {
  const dataError = [];
  const dataUpdate = [];
  data.forEach((item) => {
    if (!has(dataCodeMap, item.code)) {
      dataError.push(item);
    } else {
      dataUpdate.push(item);
    }
  });
  return { dataUpdate, dataError };
}
