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
  SourceAddressEnum,
  SyncStatusEnum,
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
  //   example: PurchaseRequestStatusEnum.DRAFT,
  //   enum: valuesEnum(PurchaseRequestStatusEnum),
  //   description: JSON.stringify(objectEnum(PurchaseRequestStatusEnum)),
  // })
  // @Expose()
  // @IsIn(valuesEnum(PurchaseRequestStatusEnum))
  // status: PurchaseRequestStatusEnum // client không được phép gửi lên status

  @ApiProperty({ type: ItemUpsertBody, isArray: true })
  @Expose()
  @Type(() => ItemUpsertBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  items: ItemUpsertBody[]

  @ApiProperty({ example: 'RQ_OO1' })
  @Expose()
  @IsString()
  code: string

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
    example: SourceAddressEnum.Japan,
    enum: valuesEnum(SourceAddressEnum),
    description: JSON.stringify(objectEnum(SourceAddressEnum)),
  })
  @Expose()
  @IsIn(valuesEnum(SourceAddressEnum))
  sourceAddress: SourceAddressEnum // Chỉ sử dụng cho SMC

  @ApiProperty({
    example: SyncStatusEnum.NotSyncYet,
    enum: valuesEnum(SyncStatusEnum),
    description: JSON.stringify(objectEnum(SyncStatusEnum)),
  })
  @Expose()
  @IsIn(valuesEnum(SyncStatusEnum))
  syncStatus: SyncStatusEnum // Chỉ sử dụng cho SMC

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  currencyId: number

  @ApiProperty({ example: 'Ghi chú' })
  @Expose()
  @IsString()
  note: string
}

export class PurchaseRequestUpdateBody extends OmitType(PurchaseRequestCreateBody, ['code']) {}
