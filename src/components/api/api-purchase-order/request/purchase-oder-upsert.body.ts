import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsIn, IsString } from 'class-validator'

export class PurchaseOrderCreateBody {
  @ApiPropertyOptional({ example: 2 })
  @Expose()
  @IsIn([0, 1])
  status: number

  @ApiPropertyOptional({ example: 1 })
  @Expose()
  @IsString()
  description: string
}

export class PurchaseOrderUpdateBody extends PurchaseOrderCreateBody {}
