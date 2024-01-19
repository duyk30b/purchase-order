import { Expose } from 'class-transformer'
import { ArrayMinSize, IsArray, IsString } from 'class-validator'

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
