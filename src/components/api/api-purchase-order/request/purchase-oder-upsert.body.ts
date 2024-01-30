import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
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
  DeliveryKind,
  DeliveryMethod,
  PurchaseOrderKind,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import { PoItemDeliveryUpsertBody } from './po-item-delivery-upsert.body'
import { PoItemUpsertBody } from './po-item-upsert.body'

export class PoPaymentPlanBody {
  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  expectedDate: Date // ngày dự kiến

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  paymentMethod: number // Phương thức thanh toán

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  paymentPercent: number // phần trăm thanh toán

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  amount: string // Thành tiền (total x tax)

  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  description: string
}
export class PoAttachFileBody {
  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  fileName: string

  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  link: string

  @ApiProperty({ example: 3000 })
  @Expose()
  @IsNumber()
  size: number

  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  description: string
}
export class PoNoteBody {
  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  date: Date

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  userId: number // Loại tiền tệ

  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  content: string
}

export class PurchaseOrderCreateBody {
  // @ApiProperty({
  //   example: PurchaseOrderStatus.DRAFT,
  //   enum: valuesEnum(PurchaseOrderStatus),
  //   description: JSON.stringify(objectEnum(PurchaseOrderStatus)),
  // })
  // @Expose()
  // @IsIn(valuesEnum(PurchaseOrderStatus))
  // status: PurchaseOrderStatus // client không được phép gửi lên status

  // @ApiProperty({
  //   example: PoPaymentStatus.PARTIAL,
  //   enum: valuesEnum(PoPaymentStatus),
  //   description: JSON.stringify(objectEnum(PoPaymentStatus)),
  // })
  // @Expose()
  // @IsIn(valuesEnum(PoPaymentStatus))
  // poPaymentStatus: PoPaymentStatus // client không được phép gửi lên status

  @ApiProperty({ type: PoItemUpsertBody, isArray: true })
  @Expose()
  @Type(() => PoItemUpsertBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poItems: PoItemUpsertBody[]

  @ApiProperty({ type: PoItemDeliveryUpsertBody, isArray: true })
  @Expose()
  @Type(() => PoItemDeliveryUpsertBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poDeliveryItems: PoItemDeliveryUpsertBody[]

  @ApiProperty({ type: PoPaymentPlanBody, isArray: true })
  @Expose()
  @Type(() => PoPaymentPlanBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poPaymentPlans: PoPaymentPlanBody[]

  @ApiProperty({ type: PoAttachFileBody, isArray: true })
  @Expose()
  @Type(() => PoAttachFileBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poAttachFiles: PoAttachFileBody[]

  @ApiProperty({ type: PoNoteBody, isArray: true })
  @Expose()
  @Type(() => PoNoteBody)
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poNotes: PoNoteBody[]

  @ApiProperty({ example: 'PR-0000001' })
  @Expose()
  @IsString()
  purchaseRequestCode: string

  @ApiProperty({ example: '63fdde9517a7317f0e8f959a' })
  @Expose()
  @IsMongoId()
  supplierId: string

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  orderDate: Date

  @ApiProperty({
    example: PurchaseOrderKind.DOMESTIC,
    enum: valuesEnum(PurchaseOrderKind),
    description: JSON.stringify(objectEnum(PurchaseOrderKind)),
  })
  @Expose()
  @IsIn(valuesEnum(PurchaseOrderKind))
  purchaseOrderKind: PurchaseOrderKind // loại đơn hàng

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  incotermsId: string

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  manufacturingCountryId: number // Nước sản xuất

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  contractCode: string // Mã hợp đồng

  @ApiProperty({ example: true })
  @Expose()
  @IsBoolean()
  priceIncludesTax: true // giá đã bao gồm thuế

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  currencyId: number // Loại tiền tệ

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  totalMoney: string // Tổng tiền (giá mua x số lượng x chiết khấu)

  @ApiProperty({ example: '12.456' })
  @Expose()
  @IsString()
  taxMoney: string // thuế suất

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  amount: string // Thành tiền (total x tax)

  @ApiProperty({
    example: DeliveryKind.ONE_TIME,
    enum: valuesEnum(DeliveryKind),
    description: JSON.stringify(objectEnum(DeliveryKind)),
  })
  @Expose()
  @IsIn(valuesEnum(DeliveryKind))
  deliveryKind: DeliveryKind // phương thức vận chuyển

  @ApiProperty({ example: '2024-01-19T06:50:24.977Z' })
  @Expose()
  @Transform(({ value }) => (value ? new Date() : undefined))
  @IsDate()
  deliveryDate: Date

  @ApiProperty({
    example: DeliveryMethod.COURIER,
    enum: valuesEnum(DeliveryMethod),
    description: JSON.stringify(objectEnum(DeliveryMethod)),
  })
  @Expose()
  @IsIn(valuesEnum(DeliveryMethod))
  deliveryMethod: DeliveryMethod // phương thức vận chuyển

  @ApiProperty({ example: '12.4567' })
  @Expose()
  @IsDefined()
  @IsString()
  deliveryExpense: string // Chi phí vận chuyển

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  departure: string // Nơi đi

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  destination: string // Nơi đến

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  pack: string // Nơi đến

  @ApiProperty({ example: 12 })
  @Expose()
  @IsNumber()
  paymentPeriodId: number // kỳ thanh toán
}

export class PurchaseOrderUpdateBody extends PurchaseOrderCreateBody {}
