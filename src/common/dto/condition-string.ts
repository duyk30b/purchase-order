import { Expose, TransformFnParams, plainToInstance } from 'class-transformer'
import { ArrayMinSize, IsArray, IsString, validateSync } from 'class-validator'

export class ConditionString {
  @Expose()
  @IsString()
  '=='?: string

  @Expose()
  @IsString()
  'EQUAL'?: string

  @Expose()
  @IsString()
  '!='?: string

  @Expose()
  @IsString()
  'NOT'?: string

  @Expose()
  @IsString()
  'IS_NULL'?: boolean

  @Expose()
  @IsString()
  'NOT_NULL'?: boolean

  @Expose()
  @IsString()
  'LIKE'?: string

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  'IN'?: string[]
}

export const transformConditionString = ({ value, key }: TransformFnParams) => {
  if (!value) {
    return
  }
  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'object') {
    const instance = plainToInstance(ConditionString, value, {
      exposeUnsetFields: false,
      excludeExtraneousValues: false,
    })
    const validate = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
    if (validate.length) throw new Error(`${key} must be a String`)
    return instance
  } else {
    throw new Error(`${key} must be a String`)
  }
}
