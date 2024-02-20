import { Expose, TransformFnParams, plainToInstance } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  validateSync,
} from 'class-validator'

export class ConditionNumber {
  @Expose()
  @IsNumber()
  '>'?: number

  @Expose()
  @IsNumber()
  'GT'?: number

  @Expose()
  @IsNumber()
  '>='?: number

  @Expose()
  @IsNumber()
  'GTE'?: number

  @Expose()
  @IsNumber()
  '<'?: number

  @Expose()
  @IsNumber()
  'LT'?: number

  @Expose()
  @IsNumber()
  '<='?: number

  @Expose()
  @IsNumber()
  'LTE'?: number

  @Expose()
  @IsNumber()
  '=='?: number

  @Expose()
  @IsNumber()
  'EQUAL'?: number

  @Expose()
  @IsNumber()
  '!='?: number

  @Expose()
  @IsNumber()
  'NOT'?: number

  @Expose()
  @IsBoolean()
  'IS_NULL'?: boolean

  @Expose()
  @IsBoolean()
  'NOT_NULL'?: boolean

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  'IN'?: number[]

  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  'BETWEEN'?: [number, number]
}

export const transformConditionNumber = ({ value, key }: TransformFnParams) => {
  if (!value) {
    return
  }
  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'object') {
    const instance = plainToInstance(ConditionNumber, value)
    const validate = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
    if (validate.length) throw new Error(`${key} must be a Number`)
    return instance
  } else {
    throw new Error(`${key} must be a Number`)
  }
}
