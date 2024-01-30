import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'
import { IdMongoParam } from '../../../common/dto/param'
import { External, TExternal } from '../../../core/decorator/request-external'
import { PermissionCode } from '../../../core/guard/authorization.guard'
import { PURCHASE_ORDER_CREATE } from '../../../core/guard/permission-purchase-order'
import { PurchaseOrderStatus } from '../../../mongo/purchase-order/purchase-order.schema'
import { ApiPurchaseOrderService } from './api-purchase-order.service'
import {
  PurchaseOrderCreateBody,
  PurchaseOrderGetManyQuery,
  PurchaseOrderGetOneQuery,
  PurchaseOrderPaginationQuery,
  PurchaseOrderUpdateBody,
} from './request'
import { ApiPurchaseOrderCreateService } from './service/api-purchase-order-create.service'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderPaginationService } from './service/api-purchase-order-pagination.service'

@ApiTags('PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller('customer')
export class ApiPurchaseOrderController {
  constructor(
    private readonly apiPurchaseOrderService: ApiPurchaseOrderService,
    private readonly apiPurchaseOrderPaginationService: ApiPurchaseOrderPaginationService,
    private readonly apiPurchaseOrderDetailService: ApiPurchaseOrderDetailService,
    private readonly apiPurchaseOrderCreateService: ApiPurchaseOrderCreateService
  ) {}

  @Get('pagination')
  pagination(@Query() query: PurchaseOrderPaginationQuery) {
    return this.apiPurchaseOrderPaginationService.pagination(query)
  }

  @Get('list')
  list(@Query() query: PurchaseOrderGetManyQuery) {
    return this.apiPurchaseOrderService.getMany(query)
  }

  @Get('detail/:id')
  async detail(
    @Param() { id }: IdMongoParam,
    @Query() query: PurchaseOrderGetOneQuery
  ) {
    return await this.apiPurchaseOrderDetailService.getOne(id, query)
  }

  @Post('create-draft')
  @PermissionCode(PURCHASE_ORDER_CREATE.code)
  async createDraft(
    @External() { user }: TExternal,
    @Body() body: PurchaseOrderCreateBody
  ) {
    return await this.apiPurchaseOrderCreateService.createOne(
      body,
      user.id,
      PurchaseOrderStatus.DRAFT
    )
  }

  @Post('create-wait-confirm')
  @PermissionCode(PURCHASE_ORDER_CREATE.code)
  async createWaitConfirm(
    @External() { user }: TExternal,
    @Body() body: PurchaseOrderCreateBody
  ) {
    return await this.apiPurchaseOrderCreateService.createOne(
      body,
      user.id,
      PurchaseOrderStatus.WAIT_CONFIRM
    )
  }

  @Patch('update/:id')
  async update(
    @Param() { id }: IdMongoParam,
    @Body() body: PurchaseOrderUpdateBody
  ) {
    return await this.apiPurchaseOrderService.updateOne(id, body)
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id', example: 1 })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderService.deleteOne(id)
  }
}
