import {
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'
import { LimitQuery, PaginationQuery } from '../../../../common/dto/query'
import {
  PoPaymentStatus,
  PurchaseOrderKind,
  PurchaseOrderStatus,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import {
  PurchaseOrderFilterQuery,
  PurchaseOrderRelationQuery,
  PurchaseOrderSortQuery,
} from './purchase-order-options.request'

export class PurchaseOrderGetQuery {
  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<PurchaseOrderRelationQuery>{
      poDeliveryItems: true,
      purchaseOrderItems: true,
      purchaseOrderHistories: true,
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderRelationQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  relation: PurchaseOrderRelationQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<PurchaseOrderFilterQuery>{
      searchText: 'AAA',
      code: 'PO',
      purchaseRequestCode: { LIKE: 'PR-' },
      orderDate: { BETWEEN: [new Date(), new Date()] },
      deliveryDate: { GTE: new Date() },
      supplierId: '63fdde9517a7317f0e8f959a',
      purchaseOrderKind: PurchaseOrderKind.DOMESTIC,
      createdByUserId: 3,
      poPaymentStatus: PoPaymentStatus.PARTIAL,
      status: PurchaseOrderStatus.CONFIRM,
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderFilterQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  filter?: PurchaseOrderFilterQuery

  @ApiPropertyOptional({
    type: String,
    example: JSON.stringify(<PurchaseOrderSortQuery>{
      id: 'ASC',
      purchaseRequestCode: 'DESC',
      supplierId: 'ASC',
      orderDate: 'DESC',
      deliveryDate: 'ASC',
    }),
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      if (!value) return undefined // return undefined để không validate nữa
      const plain = JSON.parse(value)
      return plainToInstance(PurchaseOrderSortQuery, plain, {
        exposeUnsetFields: false,
        excludeExtraneousValues: false, // không bỏ qua field thừa, để validate chết nó
      })
    } catch (error: any) {
      return error.message
    }
  })
  @IsObject()
  @ValidateNested({ each: true })
  sort?: PurchaseOrderSortQuery
}

export class PurchaseOrderPaginationQuery extends IntersectionType(
  PurchaseOrderGetQuery,
  PaginationQuery
) {}

export class PurchaseOrderGetManyQuery extends IntersectionType(
  PickType(PurchaseOrderGetQuery, ['filter', 'relation', 'sort']),
  LimitQuery
) {}

export class PurchaseOrderGetOneQuery extends PickType(PurchaseOrderGetQuery, [
  'relation',
]) {}

export class PurchaseOrderGetOneByIdQuery extends PickType(
  PurchaseOrderGetQuery,
  ['relation']
) {}
