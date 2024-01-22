import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsDefined,
  IsIn,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { objectEnum, valuesEnum } from '../../../../common/helpers'
import {
  SourceAddress,
  SyncStatus,
} from '../../../../mongo/purchase-request/purchase-request.schema'

export class ItemUpsertBody {
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
  itemUnitId: number

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  deliveryTerm: Date

  @ApiProperty({ example: 12 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quantity: number

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  price: string
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

  @ApiProperty({ example: '63fdde9517a7317f0e8f959a' })
  @Expose()
  @IsMongoId()
  vendorId: string

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

  @ApiProperty({ example: '63fdde9517a7317f0e8f959a' })
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
  currencyId: number

  @ApiProperty({ example: 'Ghi chú' })
  @Expose()
  @IsString()
  note: string
}

export class PurchaseRequestUpdateBody extends PurchaseRequestCreateBody {}
