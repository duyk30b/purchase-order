import { Expose, TransformFnParams, plainToInstance } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  isMongoId,
  validateSync,
} from 'class-validator'

export class ConditionMongoId {
  @Expose()
  @IsMongoId()
  '=='?: string

  @Expose()
  @IsMongoId()
  'EQUAL'?: string

  @Expose()
  @IsMongoId()
  '!='?: string

  @Expose()
  @IsMongoId()
  'NOT'?: string

  @Expose()
  @IsMongoId()
  'IS_NULL'?: boolean

  @Expose()
  @IsMongoId()
  'NOT_NULL'?: boolean

  @Expose()
  @IsMongoId()
  'LIKE'?: string

  @Expose()
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  'IN'?: string[]
}

export const transformConditionMongoId = ({
  value,
  key,
}: TransformFnParams) => {
  if (!value) return undefined

  if (typeof value === 'string') {
    const validate = isMongoId(value)
    if (!validate) throw new Error(`${key} must be a mongoID`)
    return value
  } else if (typeof value === 'object') {
    const instance = plainToInstance(ConditionMongoId, value, {
      exposeUnsetFields: false,
      excludeExtraneousValues: false,
    })
    const validate = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
    if (validate.length) throw new Error(`${key} must be a mongoID`)
    return instance
  } else {
    throw new Error(`${key} must be a mongoID`)
  }
}
