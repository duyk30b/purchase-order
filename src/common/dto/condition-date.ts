import {
  Expose,
  Transform,
  TransformFnParams,
  plainToInstance,
} from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  isDateString,
  validateSync,
} from 'class-validator'

export class ConditionDate {
  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '>'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'GT'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '>='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'GTE'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '<'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'LT'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '<='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'LTE'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '=='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'EQUAL'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  '!='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  'NOT'?: Date

  @Expose()
  @IsBoolean()
  'IS_NULL'?: boolean

  @Expose()
  @IsBoolean()
  'NOT_NULL'?: boolean

  @Expose()
  @Transform(({ value }) => {
    if (!value) return undefined
    return value.map((v: string | Date) => new Date(v))
  })
  @IsArray()
  @IsDate({ each: true })
  @ArrayMinSize(1)
  'IN'?: Date[]

  @Expose()
  @Transform(({ value }) => {
    if (!value) return undefined
    return value.map((v: string | Date) => new Date(v))
  })
  @IsArray()
  @IsDate({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  'BETWEEN'?: [Date, Date]
}

export const transformConditionDate = ({ value, key }: TransformFnParams) => {
  if (!value) return undefined

  if (typeof value === 'string') {
    const validate = isDateString(value)
    if (!validate) throw new Error(`${key} must be a DateString`)
    return value
  } else if (typeof value === 'object') {
    const instance = plainToInstance(ConditionDate, value, {
      exposeUnsetFields: false,
      excludeExtraneousValues: false,
    })
    const validate = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
    if (validate.length) throw new Error(`${key} must be a DateString`)
    return instance
  } else {
    throw new Error(`${key} must be a DateString`)
  }
}
