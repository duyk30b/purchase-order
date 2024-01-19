import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsBoolean, IsDate, IsIn, IsMongoId, IsNumber, IsString } from 'class-validator'
import { objectEnum, valuesEnum } from '../../../../common/helpers'
import {
  PurchaseRequestStatusEnum,
  SourceAddress,
} from '../../../../mongo/purchase-request/purchase-request.schema'

export class PurchaseRequestCreateBody {
  // @ApiProperty({
  //   example: PurchaseRequestStatusEnum.DRAFT,
  //   enum: valuesEnum(PurchaseRequestStatusEnum),
  //   description: JSON.stringify(objectEnum(PurchaseRequestStatusEnum)),
  // })
  // @Expose()
  // @IsIn(valuesEnum(PurchaseRequestStatusEnum))
  // status: PurchaseRequestStatusEnum // client không được phép gửi lên status

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
    example: SourceAddress.Japan,
    enum: valuesEnum(SourceAddress),
    description: JSON.stringify(objectEnum(SourceAddress)),
  })
  @Expose()
  @IsIn(valuesEnum(SourceAddress))
  sourceAddress: SourceAddress // Chỉ sử dụng cho SMC

  @ApiProperty({ example: true })
  @Expose()
  @IsBoolean()
  sourceSync: boolean // Chỉ sử dụng cho SMC

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
