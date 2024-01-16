import Big from 'big.js';
import { floor, isArray, isEmpty, isNaN, replace, uniq } from 'lodash';
import { PaginationQuery } from './dto/request/pagination.query';
import { REGEX_FOR_FILTER } from '@constant/common';
import { FileUpload } from '@core/dto/request/file.request.dto';
import * as moment from 'moment';

export const minus = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).minus(new Big(cur))));
};

export const plus = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).plus(new Big(cur))));
};

export const mul = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).mul(new Big(cur))));
};

export const div = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).div(new Big(cur))));
};

export const decimal = (x: number, y: number): number => {
  const mathOne = Number(new Big(10).pow(Number(new Big(x).minus(new Big(y)))));
  const mathTwo = Number(new Big(10).pow(Number(new Big(y).mul(new Big(-1)))));
  return Number(mathOne - mathTwo);
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const convertArrayToMap = (array, key: string[]) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    const keyBuilt = key.reduce((res, i) => {
      return `${res}_${item[i]}`;
    }, '');
    return {
      ...obj,
      [keyBuilt]: item,
    };
  }, initialValue);
};

export const convertInputToInt = (str: any): number => {
  const number = Number(str);
  if (isNaN(number) || number - parseInt(str) !== 0) {
    return 0;
  }
  return number;
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const convertToOrderCondition = (
  paging: PaginationQuery,
  keys: string[],
): any => {
  const sorts = {};
  if (paging.sort && isArray(paging.sort)) {
    paging.sort.forEach((sort) => {
      if (!keys.includes(sort.column)) return;
      sorts[sort.column] = sort.order;
    });
  }
  return sorts;
};

export const convertToSkip = (paging: PaginationQuery): number => {
  const page = (Number(paging.page) || 1) - 1;
  const take = convertToTake(paging);
  return (page < 0 ? 0 : page) * take;
};

export const convertToTake = (paging: PaginationQuery): number => {
  const limit = Number(paging.limit) || 10;
  return limit > 0 && limit <= 200 ? limit : 10;
};

export const distinctArray = (arr: number[]): number[] => {
  return uniq(arr.filter((e) => e));
};

export const serilizeData = (arrData: number[], column: string): number[] => {
  if (arrData.length > 0) {
    const serilize = [];
    arrData.forEach((record) => {
      serilize[record[column]] = record;
    });

    return serilize;
  }

  return arrData;
};

export const convertOrderMongo = (orderText: string): number => {
  if (orderText.toLowerCase() === 'desc') return -1;
  return 1;
};

export const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const paginate = (
  unPaginatedList: any[],
  limit: number,
  page: number,
): any[] => unPaginatedList.slice((page - 1) * limit, page * limit);

export const getDataDuplicate = (array: any[]): any => {
  return array.filter((value, index, arr) => {
    return arr.indexOf(value) !== index;
  });
};

export const mergePayload = (param: any, body: any): any => {
  const keys = [...new Set([...Object.keys(param), ...Object.keys(body)])];
  const payload: any = {};
  keys.forEach((key) => {
    payload[key] = {
      ...param[key],
      ...body[key],
    };
  });

  return payload;
};

export const getRegexByValue = (value: string) => {
  return {
    $regex: '.*' + replace(value, REGEX_FOR_FILTER, (e) => `\\${e}`) + '.*',
    $options: 'i',
  };
};

export const getFileSize = (file: FileUpload) => {
  return file?.data?.byteLength || 0;
};

export const validateFileSizes = (files: FileUpload[], maxSizeFile: number) => {
  return files.every((file) => {
    return minus(getFileSize(file), maxSizeFile) <= 0;
  });
};

export const isSubarray = (a: any[], b: any[]) => {
  const setB = new Set(b);

  for (const element of a) {
    if (!setB.has(element)) {
      return false;
    }
  }

  return true;
};

export const formatDate = (date) => {
  if (!date) return null;
  return moment.utc(date).utcOffset('+07:00').format('DD/MM/YYYY');
};
