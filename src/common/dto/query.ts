import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsIn, IsInt, Max, Min } from 'class-validator'

export class PaginationQuery {
  @ApiPropertyOptional({ example: 1 })
  @Expose()
  @Transform(({ value }) => parseInt(value)) // để không cho truyền linh tinh, ví dụ dạng chữ
  @IsInt()
  @Min(1)
  page: number

  @ApiPropertyOptional({ example: 10 })
  @Expose()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(3)
  @Max(100)
  limit: number
}

export class LimitQuery {
  @ApiPropertyOptional({ example: 10 })
  @Expose()
  @Transform(({ value }) => (value ? parseInt(value) : undefined)) // có thể không truyền
  @IsInt()
  @Min(3)
  @Max(100)
  limit: number
}

export class SortQuery {
  @Expose({ name: 'id' })
  @IsIn(['ASC', 'DESC'])
  id: 'ASC' | 'DESC'
}
