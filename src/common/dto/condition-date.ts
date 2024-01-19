import { Expose, Transform } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDate } from 'class-validator'

export class ConditionDate {
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '>'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  'GT'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '>='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  'GTE'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '<'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  'LT'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '<='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  'LTE'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '=='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  'EQUAL'?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  '!='?: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
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
