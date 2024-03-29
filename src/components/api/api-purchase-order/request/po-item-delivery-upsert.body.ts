import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  IsDate,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator'

export class PoItemDeliveryUpsertBody {
  @ApiProperty({ example: 1 })
  @Expose()
  @IsDefined()
  @IsNumber()
  poItemLine: number // Thứ tự item trên PO

  @ApiProperty({ example: 1.2 })
  @Expose()
  @IsDefined()
  @IsString()
  poDeliveryLine: string // Thứ tự item trên PO

  @ApiProperty({ example: '63fdde9517a7317f0e8f959a' })
  @Expose()
  @IsMongoId()
  purchaseRequestItemId: string

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemId: number

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemUnitId: number // đơn vị tính => trường này lấy theo nhà cung cấp

  @ApiProperty({ example: 22 })
  @Expose()
  @IsNumber()
  deliveryTerm: number // thời hạn giao hàng => trường này lấy theo nhà cung cấp

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  quantityBuy: number

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  quantityPlanDelivery: number

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  warehouseIdReceiving: number

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  deliveryDate: Date // ngày giao kế hoạch
}
