import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'
import { IdMongoParam } from '../../../common/dto/param'
import { External, TExternal } from '../../../core/decorator/request-external'
import { PermissionCode } from '../../../core/guard/authorization.guard'
import {
  PURCHASE_REQUEST_CREATE,
  PURCHASE_REQUEST_DETAIL,
  PURCHASE_REQUEST_LIST,
} from '../../../core/guard/permission-purchase-request'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import {
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'

@ApiTags('PurchaseRequest')
@ApiBearerAuth('access-token')
@Controller('purchase-request')
export class ApiPurchaseRequestController {
  constructor(private readonly apiPurchaseRequestService: ApiPurchaseRequestService) {}

  @Get('pagination')
  @PermissionCode(PURCHASE_REQUEST_LIST.code)
  pagination(@Query() query: PurchaseRequestPaginationQuery) {
    return this.apiPurchaseRequestService.pagination(query)
  }

  @Get('list')
  list(@Query() query: PurchaseRequestGetManyQuery) {
    return this.apiPurchaseRequestService.getMany(query)
  }

  @Get('detail/:id')
  @PermissionCode(PURCHASE_REQUEST_DETAIL.code)
  async detail(@Param() { id }: IdMongoParam, @Query() query: PurchaseRequestGetOneQuery) {
    return await this.apiPurchaseRequestService.getOne(id, query)
  }

  @Post('create')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async create(@External() { user }: TExternal, @Body() body: PurchaseRequestCreateBody) {
    return await this.apiPurchaseRequestService.createOne(body, user.id)
  }

  @Patch('update/:id')
  async update(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam,
    @Body() body: PurchaseRequestUpdateBody
  ) {
    return await this.apiPurchaseRequestService.updateOne({ id, body, userId: user.id })
  }

  @Patch('wait-confirm/:id')
  async waitConfirm(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.waitConfirm({ id, userId: user.id })
  }

  @Patch('confirm/:id')
  async confirm(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.confirm({ id, userId: user.id })
  }

  @Patch('reject/:id')
  async reject(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.reject({ id, userId: user.id })
  }

  @Patch('cancel/:id')
  async cancel(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.cancel({ id, userId: user.id })
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id', example: 1 })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.deleteOne(id)
  }
}
