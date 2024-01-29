import { Expose } from 'class-transformer'
import { ArrayMinSize, IsArray, IsMongoId } from 'class-validator'

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
