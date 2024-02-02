import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
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
import { MultipleFileUpload } from '../../../../common/dto/file'
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

export class PoAttachFileBody {
  @ApiProperty({ example: 'abc.png' })
  @Expose()
  @IsString()
  fileName: string

  @ApiProperty({ example: 'ABC_ZXX' })
  @Expose()
  @IsString()
  description: string
}

export class PurchaseOrderCreateBody extends MultipleFileUpload {
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

  @ApiProperty({
    type: String,
    example: JSON.stringify(<PoItemUpsertBody[]>[
      {
        prLine: 1,
        purchaseRequestItemId: '63fdde9517a7317f0e8f959a',
        itemId: 12,
        itemUnitId: 12,
        deliveryTerm: new Date('2024-01-19T06:50:24.977Z'),
        quantityPrimary: 12,
        quantitySecondary: 12,
        discount: 12,
        price: '12.4567',
        totalMoney: '12.4567',
        tax: 12,
        amount: '12.4567',
      },
    ]),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      const plain = JSON.parse(value || '[]')
      return plainToInstance(PoItemUpsertBody, plain)
    } catch (error: any) {
      return error.message
    }
  })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poItems: PoItemUpsertBody[]

  @ApiProperty({
    type: String,
    example: JSON.stringify(<PoItemDeliveryUpsertBody[]>[
      {
        purchaseRequestItemId: '63fdde9517a7317f0e8f959a',
        itemId: 12,
        itemUnitId: 12, // đơn vị tính => trường này lấy theo nhà cung cấp
        deliveryTerm: new Date('2024-01-19T06:50:24.977Z'), // thời hạn giao hàng => trường này lấy theo nhà cung cấp
        quantityBuy: 12,
        quantityDelivery: 12,
        warehouseIdReceiving: 12,
        deliveryDate: new Date('2024-01-19T06:50:24.977Z'), // ngày giao kế hoạch
      },
    ]),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      const plain = JSON.parse(value || '[]')
      return plainToInstance(PoItemDeliveryUpsertBody, plain)
    } catch (error: any) {
      return error.message
    }
  })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poDeliveryItems: PoItemDeliveryUpsertBody[]

  @ApiProperty({
    type: String,
    example: JSON.stringify(<PoPaymentPlanBody[]>[
      {
        expectedDate: new Date('2024-01-19T06:50:24.977Z'),
        paymentMethod: 12,
        paymentPercent: 12, // đơn vị tính => trường này lấy theo nhà cung cấp
        amount: '12',
        description: 'xxx', // thời hạn giao hàng => trường này lấy theo nhà cung cấp
      },
    ]),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      const plain = JSON.parse(value || '[]')
      return plainToInstance(PoPaymentPlanBody, plain)
    } catch (error: any) {
      return error.message
    }
  })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poPaymentPlans: PoPaymentPlanBody[]

  @ApiProperty({
    type: String,
    example: JSON.stringify(<PoAttachFileBody[]>[
      {
        fileName: 'ABC',
        description: 'xxx', // thời hạn giao hàng => trường này lấy theo nhà cung cấp
      },
    ]),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      const plain = JSON.parse(value || '[]')
      return plainToInstance(PoAttachFileBody, plain)
    } catch (error: any) {
      return error.message
    }
  })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  poAttachFiles: PoAttachFileBody[]

  @ApiProperty({
    type: String,
    example: JSON.stringify(<PoNoteBody[]>[
      {
        date: new Date('2024-01-19T06:50:24.977Z'),
        userId: 12,
        content: 'xxx', // thời hạn giao hàng => trường này lấy theo nhà cung cấp
      },
    ]),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      const plain = JSON.parse(value || '[]')
      return plainToInstance(PoNoteBody, plain)
    } catch (error: any) {
      return error.message
    }
  })
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
  @Type(() => Number)
  @IsIn(valuesEnum(PurchaseOrderKind))
  purchaseOrderKind: PurchaseOrderKind // loại đơn hàng

  @ApiProperty({ example: 1 })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  incotermId: number

  @ApiProperty({ example: 12 })
  @Expose()
  @Type(() => Number)
  @IsNumber()
  manufacturingCountryId: number // Nước sản xuất

  @ApiProperty({ example: 'XYZ' })
  @Expose()
  @IsString()
  contractCode: string // Mã hợp đồng

  @ApiProperty({ example: true })
  @Expose()
  @Transform(({ value }) => ['true', true, '1', 1].includes(value))
  @IsBoolean()
  priceIncludesTax: true // giá đã bao gồm thuế

  @ApiProperty({ example: 12 })
  @Expose()
  @Type(() => Number)
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
  @Type(() => Number)
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
  @Type(() => Number)
  @IsNumber()
  paymentPeriodId: number // kỳ thanh toán
}

export class PurchaseOrderUpdateBody extends PurchaseOrderCreateBody {}
