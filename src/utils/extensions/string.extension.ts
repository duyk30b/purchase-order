import { SORT_CONST, SortOrder } from '@constant/database.constant';

declare global {
  interface String {
    toSortOrder(this: string): SortOrder;
    isMatchKeyword(this: string, keyword: string): boolean;
    removeVietnameseSign(this: string): string;
  }
}

String.prototype.toSortOrder = function (): SortOrder {
  if (!this) return null;

  switch (this.toLowerCase()) {
    case SORT_CONST.ASCENDING:
      return SortOrder.Ascending;
    case SORT_CONST.DESCENDING:
      return SortOrder.Descending;
    default:
      return null;
  }
};

String.prototype.isMatchKeyword = function (keyword: string): boolean {
  return new RegExp(`.*${keyword}.*`, 'gi').test(this);
};

String.prototype.removeVietnameseSign = function (this: string): string {
  return this.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};
