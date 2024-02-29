import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'

export class CreateYn02SapRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  costCenterId: string

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  purchaseOrderId: string

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  vendorId: string

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isApplyFee: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateYn02SapRequestDetailDto)
  @ArrayNotEmpty()
  details: CreateYn02SapRequestDetailDto[]
}

class CreateYn02SapRequestDetailDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  warehouseId: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  itemId: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  itemTypeSettingId: number

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  requestMainQuantity: number

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  requestSubQuantity: number

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  price: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currencyType: string

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  amount: number

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  locatorId: string
}
