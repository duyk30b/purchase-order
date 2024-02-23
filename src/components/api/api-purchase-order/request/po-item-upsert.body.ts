import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import {
  IsDate,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator'

export class PoItemUpsertBody {
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  prItemLine: number // Thứ tự item trên PR

  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  poItemLine: number // Thứ tự item trên PO

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
  discount: number

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  price: string // giá sản phẩm

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  totalMoney: string // Tổng tiền (giá mua x số lượng x chiết khấu)

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  tax: number // thuế suất

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  amount: string // Thành tiền (total x tax)
}
