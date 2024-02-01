import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsDefined,
  IsIn,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { objectEnum, valuesEnum } from '../../../../common/helpers'
import {
  SourceAddress,
  SyncStatus,
} from '../../../../mongo/purchase-request/purchase-request.schema'

export class ItemUpsertBody {
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  line: number // Thứ tự

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemId: number

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemTypeId: number

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemUnitId: number // đơn vị tính => trường này lấy theo nhà cung cấp

  @ApiProperty({ example: 15 })
  @Expose()
  @IsNumber()
  deliveryTerm: number // thời hạn giao hàng => trường này lấy theo nhà cung cấp

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  quantity: number

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  price: string // giá sản phẩm

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  amount: string // giá sản phẩm
}

export class PurchaseRequestCreateBody {
  // @ApiProperty({
  //   example: PurchaseRequestStatus.DRAFT,
  //   enum: valuesEnum(PurchaseRequestStatus),
  //   description: JSON.stringify(objectEnum(PurchaseRequestStatus)),
  // })
  // @Expose()
  // @IsIn(valuesEnum(PurchaseRequestStatus))
  // status: PurchaseRequestStatus // client không được phép gửi lên status

  @ApiProperty({ type: ItemUpsertBody, isArray: true })
  @Expose()
  @Type(() => ItemUpsertBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  items: ItemUpsertBody[]

  @ApiProperty({ example: '65bb485141d769c0cdd622d9' })
  @Expose()
  @IsMongoId()
  supplierId: string

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  requestDate: Date

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  receiveDate: Date

  @ApiProperty({ example: '65a359aed1209643735ec7d5' })
  @Expose()
  @IsMongoId()
  costCenterId: string

  @ApiProperty({
    example: SourceAddress.Japan,
    enum: valuesEnum(SourceAddress),
    description: JSON.stringify(objectEnum(SourceAddress)),
  })
  @Expose()
  @IsIn(valuesEnum(SourceAddress))
  sourceAddress: SourceAddress // Chỉ sử dụng cho SMC

  @ApiProperty({
    example: SyncStatus.NotSyncYet,
    enum: valuesEnum(SyncStatus),
    description: JSON.stringify(objectEnum(SyncStatus)),
  })
  @Expose()
  @IsIn(valuesEnum(SyncStatus))
  syncStatus: SyncStatus // Chỉ sử dụng cho SMC

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  currencyId: number // Loại tiền tệ

  @ApiProperty({ example: 'Ghi chú' })
  @Expose()
  @IsString()
  note: string
}

export class PurchaseRequestUpdateBody extends PurchaseRequestCreateBody {}
