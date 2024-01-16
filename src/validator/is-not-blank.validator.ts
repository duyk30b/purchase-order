import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_NOT_BLANK = 'isNotBlank';

export function isNotBlank(val: string): boolean {
  return val && val.trim().length > 0;
}

export function IsNotBlank(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NOT_BLANK,
      validator: {
        validate: (value, args): boolean => isNotBlank(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property is not blank',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
