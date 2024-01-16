import Big from 'big.js';
import { SortOrder } from '@constant/database.constant';
import * as moment from 'moment';

export const minus = (first = 0, second = 0): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first = 0, second = 0): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first = 0, second = 0): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first = 0, second = 1): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const getDaysArray = function (start, end) {
  const arr = [];
  for (
    let dt = new Date(start);
    dt.setHours(0, 0, 0, 0) <= new Date(end).setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const getDaysBetweenDates = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate: any = new Date(start);
  const secondDate: any = new Date(end);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
};

export const truncateNumber = (number, index = 2) => {
  // cutting the number
  return +number
    .toString()
    .slice(0, number.toString().indexOf('.') + (index + 1));
};

export const validateTimeFormatHHMM = (str) => {
  const reg = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return reg.test(str);
};

export const getTimes = (time /*HH:mm*/) => {
  const [hour, minute] = time.split(':');
  return { hour: +hour, minute: +minute };
};

export const getFullDateString = (date) => {
  const dateString = new Date(date);
  const dd = String(dateString.getDate()).padStart(2, '0');
  const mm = String(dateString.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = dateString.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export const checkIsSqlId = (id: number | string) => {
  return Number.isInteger(+id);
};

export function compareFn<T>(order: SortOrder, obj1: T, obj2: T) {
  if (order == SortOrder.Ascending) {
    if (obj1 > obj2) return 1;

    if (obj1 < obj2) return -1;
  } else {
    if (obj1 < obj2) return 1;

    if (obj1 > obj2) return -1;
  }

  return 0;
}

export function compareDate(startDate: Date, endDate: Date): boolean {
  if (startDate && endDate)
    return (
      moment(startDate).startOf('day').toDate() <
      moment(endDate).endOf('day').toDate()
    );
  return true;
}

export const isDevMode = () => {
  return (
    process.env.NODE_ENV.startsWith('dev') ||
    process.env.NODE_ENV.startsWith('local') ||
    process.env.NODE_ENV.startsWith('stag')
  );
};
