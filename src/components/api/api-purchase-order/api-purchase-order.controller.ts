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
import {
  PURCHASE_ORDER_CONFIRM,
  PURCHASE_ORDER_CREATE,
  PURCHASE_ORDER_DELETE,
  PURCHASE_ORDER_DETAIL,
  PURCHASE_ORDER_LIST,
  PURCHASE_ORDER_REJECT,
  PURCHASE_ORDER_UPDATE,
  PURCHASE_ORDER_WAIT_CONFIRM,
} from '../../../core/guard/permission-purchase-order'
import { PurchaseOrderStatus } from '../../../mongo/purchase-order/purchase-order.schema'
import { ApiPurchaseOrderService } from './api-purchase-order.service'
import {
  PurchaseOrderCreateBody,
  PurchaseOrderGetManyQuery,
  PurchaseOrderGetOneQuery,
  PurchaseOrderPaginationQuery,
  PurchaseOrderUpdateBody,
} from './request'
import { ApiPurchaseOrderConfirmService } from './service/api-purchase-order-confirm.service'
import { ApiPurchaseOrderCreateService } from './service/api-purchase-order-create.service'
import { ApiPurchaseOrderDeleteService } from './service/api-purchase-order-delete.service'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderPaginationService } from './service/api-purchase-order-pagination.service'
import { ApiPurchaseOrderRejectService } from './service/api-purchase-order-reject.service'
import { ApiPurchaseOrderUpdateService } from './service/api-purchase-order-update.service'
import { ApiPurchaseOrderWaitConfirmService } from './service/api-purchase-order-wait-confirm.service'

@ApiTags('PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller('purchase-order')
export class ApiPurchaseOrderController {
  constructor(
    private readonly apiPurchaseOrderService: ApiPurchaseOrderService,
    private readonly apiPurchaseOrderPaginationService: ApiPurchaseOrderPaginationService,
    private readonly apiPurchaseOrderDetailService: ApiPurchaseOrderDetailService,
    private readonly apiPurchaseOrderCreateService: ApiPurchaseOrderCreateService,
    private readonly apiPurchaseOrderUpdateService: ApiPurchaseOrderUpdateService,
    private readonly apiPurchaseOrderDeleteService: ApiPurchaseOrderDeleteService,
    private readonly apiPurchaseOrderWaitConfirmService: ApiPurchaseOrderWaitConfirmService,
    private readonly apiPurchaseOrderRejectService: ApiPurchaseOrderRejectService,
    private readonly apiPurchaseOrderConfirmService: ApiPurchaseOrderConfirmService
  ) {}

  @Get('pagination')
  @PermissionCode(PURCHASE_ORDER_LIST.code)
  pagination(@Query() query: PurchaseOrderPaginationQuery) {
    return this.apiPurchaseOrderPaginationService.pagination(query)
  }

  @Get('list')
  list(@Query() query: PurchaseOrderGetManyQuery) {
    return this.apiPurchaseOrderService.getMany(query)
  }

  @Get('detail/:id')
  @PermissionCode(PURCHASE_ORDER_DETAIL.code)
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
    return await this.apiPurchaseOrderCreateService.createOne({
      body,
      userId: user.id,
      status: PurchaseOrderStatus.DRAFT,
    })
  }

  @Post('create-wait-confirm')
  @PermissionCode(PURCHASE_ORDER_CREATE.code)
  async createWaitConfirm(
    @External() { user }: TExternal,
    @Body() body: PurchaseOrderCreateBody
  ) {
    return await this.apiPurchaseOrderCreateService.createOne({
      body,
      userId: user.id,
      status: PurchaseOrderStatus.WAIT_CONFIRM,
    })
  }

  @Patch('update/:id')
  @PermissionCode(PURCHASE_ORDER_UPDATE.code)
  async update(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam,
    @Body() body: PurchaseOrderUpdateBody
  ) {
    return await this.apiPurchaseOrderUpdateService.update({
      id,
      body,
      userId: user.id,
    })
  }

  @Delete('delete/:id')
  @PermissionCode(PURCHASE_ORDER_DELETE.code)
  @ApiParam({ name: 'id', example: 1 })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderDeleteService.deleteOne(id)
  }

  @Patch('wait-confirm/:id')
  @PermissionCode(PURCHASE_ORDER_WAIT_CONFIRM.code)
  async waitConfirm(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseOrderWaitConfirmService.waitConfirm({
      id,
      userId: user.id,
    })
  }

  @Patch('confirm/:id')
  @PermissionCode(PURCHASE_ORDER_CONFIRM.code)
  async confirm(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseOrderConfirmService.confirm({
      id,
      userId: user.id,
    })
  }

  @Patch('reject/:id')
  @PermissionCode(PURCHASE_ORDER_REJECT.code)
  async reject(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderRejectService.reject({
      id,
      userId: user.id,
    })
  }
}
