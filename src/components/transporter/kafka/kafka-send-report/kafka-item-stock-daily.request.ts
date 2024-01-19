import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
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
import { objectEnum, valuesEnum } from 'src/common/helpers/typescript.helper'

export enum ItemStockStatusEnum {
  ImportNotPutAwayYet = 1, // Nhập chưa cất
  ImportAndPutAway = 2, // Nhập đã cẩt
  PickupNotExportYet = 3, // Lấy chưa xuất
}

export enum WarehouseTypeEnum {
  SCENE = 1, // kho hiện trường
  LOGIC = 2, // Kho logic
  NG = 3,
}

export class KafkaItemStockDailyData {
  @ApiProperty({ example: new Date('2023-11-24T16:59:59.999Z').getTime() })
  @Expose()
  @IsDefined()
  @IsNumber()
  timestampSync: number

  @ApiProperty({ example: '2023-11-24T16:59:59.999Z' })
  @Expose()
  @Type(() => Date)
  @IsDefined()
  @IsDate()
  timeSync: Date

  @ApiProperty({ example: '6490029ef9c5580ec7309590' })
  @Expose()
  @IsDefined()
  @IsMongoId()
  itemStockId: string

  @ApiProperty({
    example: ItemStockStatusEnum.ImportAndPutAway,
    description: JSON.stringify(objectEnum(WarehouseTypeEnum)),
  })
  @Expose()
  @IsDefined()
  @IsIn(valuesEnum(ItemStockStatusEnum), {
    message: `status must be enum: ${JSON.stringify(objectEnum(ItemStockStatusEnum))}`,
  })
  itemStockStatus: ItemStockStatusEnum

  @ApiProperty({ example: '2023-11-24T06:36:50.327Z' })
  @Expose()
  @Type(() => Date)
  @IsDefined()
  @IsDate()
  importDate: Date // Ngày nhập kho

  @ApiProperty({ example: 32 })
  @Expose()
  @IsDefined()
  @IsNumber()
  warehouseId: number

  @ApiProperty({ example: 'ZM02' })
  @Expose()
  @IsDefined()
  @IsString()
  warehouseCode: string

  @ApiProperty({
    example: WarehouseTypeEnum.LOGIC,
    description: JSON.stringify(objectEnum(WarehouseTypeEnum)),
  })
  @Expose()
  @IsDefined()
  @IsIn(valuesEnum(WarehouseTypeEnum), {
    message: `warehouseType must be enum: ${JSON.stringify(objectEnum(WarehouseTypeEnum))}`,
  })
  warehouseType: WarehouseTypeEnum

  @ApiProperty({ example: 'Kho thực phẩm' })
  @Expose()
  @IsDefined()
  @IsString()
  warehouseName: string

  @ApiProperty({ example: 25 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemId: number

  @ApiProperty({ example: 'X02_PS' })
  @Expose()
  @IsDefined()
  @IsString()
  itemCode: string

  @ApiProperty({ example: 'Thịt đông lạnh' })
  @Expose()
  @IsDefined()
  @IsString()
  itemNameVi: string

  @ApiProperty({ example: 'mean' })
  @Expose()
  @IsDefined()
  @IsString()
  itemNameJa: string

  @ApiProperty({ example: 'mean' })
  @Expose()
  @IsDefined()
  @IsString()
  itemNameEn: string

  @ApiProperty({ example: 33 })
  @Expose()
  @IsDefined()
  @IsNumber()
  itemTypeId: number // Mã loại sản phẩm

  @ApiProperty({ example: 'UNIT_Z' })
  @Expose()
  @IsDefined()
  @IsString()
  itemTypeCode: string // Mã loại sản phẩm

  @ApiProperty({ example: 'kg' })
  @Expose()
  @IsDefined()
  @IsString()
  itemTypeName: string // Tên loại sản phẩm

  @ApiProperty({ example: 33 })
  @Expose()
  @IsDefined()
  @IsNumber()
  packingId: number // Mã loại sản phẩm

  @ApiProperty({ example: 'QL_90' })
  @Expose()
  @IsDefined()
  @IsString()
  packingCode: string // Mã quy cách đóng gói

  @ApiProperty({ example: 'XXS' })
  @Expose()
  @IsDefined()
  @IsString()
  packingName: string // Tên quy cách đóng gói

  @ApiProperty({ example: 'Z02' })
  @Expose()
  @IsDefined()
  @IsString()
  costCenterId: string // Cost center

  @ApiProperty({ example: 'Z02' })
  @Expose()
  @IsDefined()
  @IsString()
  costCenterCode: string // Cost center

  @ApiProperty({ example: 'Z02' })
  @Expose()
  @IsDefined()
  @IsString()
  costCenterNameEn: string // Cost center

  @ApiProperty({ example: 'Z02' })
  @Expose()
  @IsDefined()
  @IsString()
  costCenterNameVi: string // Cost center

  @ApiProperty({ example: 'Z02' })
  @Expose()
  @IsDefined()
  @IsString()
  costCenterNameJa: string // Cost center

  @ApiProperty({ example: 23 })
  @Expose()
  @IsDefined()
  @IsNumber()
  bomVersionId: number // BOM version

  @ApiProperty({ example: 'Kwe' })
  @Expose()
  @IsDefined()
  @IsString()
  bomVersionCode: string // BOM version

  @ApiProperty({ example: '6490029ef9c5580ec7309590' })
  @Expose()
  @IsDefined()
  @IsMongoId()
  locatorId: string // ID vị trí

  @ApiProperty({ example: 'Tầng 2 -> Kệ 2' })
  @Expose()
  @IsDefined()
  @IsString()
  locatorPathName: string // Tên vị trí

  @ApiProperty({ example: 'Kệ 2' })
  @Expose()
  @IsDefined()
  @IsString()
  locatorName: string // Tên vị trí

  @ApiProperty({ example: '2css02' })
  @Expose()
  @IsDefined()
  @IsString()
  lotNumber: string // Lô

  @ApiProperty({ example: 99 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quality: number // Chất lượng

  @ApiProperty({ example: 'Bdq02' })
  @Expose()
  @IsDefined()
  @IsString()
  bundle: string // Bundle

  @ApiProperty({ example: 'P02' })
  @Expose()
  @IsDefined()
  @IsString()
  boxCode: string // Mã thùng

  @ApiProperty({ example: '2023-11-24T06:36:50.327Z' })
  @Expose()
  @Type(() => Date)
  // @IsDefined()
  @IsDate()
  mfg: Date // Ngày sản xuất

  @ApiProperty({ example: 3 })
  @Expose()
  @IsDefined()
  @IsNumber()
  unitIdPrimary: number // id đơn vị tính chính

  @ApiProperty({ example: 'THU' })
  @Expose()
  @IsDefined()
  @IsString()
  unitCodePrimary: string // mã đơn vị tính chính

  @ApiProperty({ example: 'Thùng' })
  @Expose()
  @IsDefined()
  @IsString()
  unitNamePrimary: string // tên đơn vị tính chính

  @ApiProperty({ example: 3 })
  @Expose()
  @IsDefined()
  @IsNumber()
  unitIdSecondary: number // id đơn vị tính phụ

  @ApiProperty({ example: 'CHAI' })
  @Expose()
  @IsDefined()
  @IsString()
  unitCodeSecondary: string // mã đơn vị tính phụ

  @ApiProperty({ example: 'Chai' })
  @Expose()
  @IsDefined()
  @IsString()
  unitNameSecondary: string // tên đơn vị tính phụ

  @ApiProperty({ example: 14 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quantityAvailablePrimary: number // số lượng tính theo đơn vị tính chính

  @ApiProperty({ example: 300 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quantityKeepPrimary: number // số lượng tính theo đơn vị tính phụ

  @ApiProperty({ example: 14 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quantityAvailableSecondary: number // số lượng tính theo đơn vị tính chính

  @ApiProperty({ example: 300 })
  @Expose()
  @IsDefined()
  @IsNumber()
  quantityKeepSecondary: number // số lượng tính theo đơn vị tính phụ
}

export class KafkaItemStockDailyMeta {
  @ApiProperty()
  @Expose()
  @IsDefined()
  ItemStockStatusEnum: Record<string, any>

  @ApiProperty()
  @Expose()
  @IsDefined()
  WarehouseTypeEnum: Record<string, any>
}

export class KafkaItemStockDailyRequest {
  @ApiProperty({ type: KafkaItemStockDailyData, isArray: true })
  @Expose()
  @Type(() => KafkaItemStockDailyData)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  data: KafkaItemStockDailyData[]

  @ApiProperty({ type: KafkaItemStockDailyMeta })
  @Expose()
  @Type(() => KafkaItemStockDailyMeta)
  @IsDefined()
  @ValidateNested({ each: true })
  meta: KafkaItemStockDailyMeta
}
