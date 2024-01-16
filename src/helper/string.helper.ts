export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const joinToCompare = (
  callback: (any) => any,
  arr: string[],
  separator: string,
): string => {
  return arr.map(callback).join(separator).toLowerCase();
};

// str: chuỗi cần valid
// num: số char
export const validateLine = (str, num) => {
  let result = '';

  let count = 0;
  const arr = str.split('');
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
    count++;
    if (count > num && arr[i] === ' ') {
      result += `...`;
      break;
    }
  }

  return result;
};

// str: chuỗi cần valid
// num: số dòng
export const validateLine1 = (str, num) => {
  let count = 0;
  let line = 1;
  const countWord = 0;
  const numberWordInLineEnd = 30;
  const numberWordInLine = 38;
  const arr1 = str.split(' ');
  let result = '';
  for (let j = countWord; j < arr1.length; j++) {
    for (let i = 0; i < arr1[j].length; i++) {
      count++;
    }
    if (count >= numberWordInLineEnd && line == num) {
      result += '...';
      break;
    }
    if (count >= numberWordInLine) {
      result = result.trim() + ' ' + arr1[j] + ' ';
      count = (' ' + arr1[j] + ' ').length;
      line++;
    } else {
      result += arr1[j] + ' ';
      count++;
    }
  }

  return result;
};