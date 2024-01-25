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
  PURCHASE_REQUEST_CANCEL,
  PURCHASE_REQUEST_CONFIRM,
  PURCHASE_REQUEST_CREATE,
  PURCHASE_REQUEST_DELETE,
  PURCHASE_REQUEST_DETAIL,
  PURCHASE_REQUEST_LIST,
  PURCHASE_REQUEST_REJECT,
  PURCHASE_REQUEST_UPDATE,
  PURCHASE_REQUEST_WAIT_CONFIRM,
} from '../../../core/guard/permission-purchase-request'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import {
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneByIdQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'

@ApiTags('PurchaseRequest')
@ApiBearerAuth('access-token')
@Controller('purchase-request')
export class ApiPurchaseRequestController {
  constructor(
    private readonly apiPurchaseRequestService: ApiPurchaseRequestService
  ) {}

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
  async detail(
    @Param() { id }: IdMongoParam,
    @Query() query: PurchaseRequestGetOneByIdQuery
  ) {
    return await this.apiPurchaseRequestService.getOne(id, query)
  }

  @Post('create')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async create(
    @External() { user }: TExternal,
    @Body() body: PurchaseRequestCreateBody
  ) {
    return await this.apiPurchaseRequestService.createOne(body, user.id)
  }

  @Patch('update/:id')
  @PermissionCode(PURCHASE_REQUEST_UPDATE.code)
  async update(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam,
    @Body() body: PurchaseRequestUpdateBody
  ) {
    return await this.apiPurchaseRequestService.updateOne({
      id,
      body,
      userId: user.id,
    })
  }

  @Patch('wait-confirm/:id')
  @PermissionCode(PURCHASE_REQUEST_WAIT_CONFIRM.code)
  async waitConfirm(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseRequestService.waitConfirm({
      id,
      userId: user.id,
    })
  }

  @Patch('confirm/:id')
  @PermissionCode(PURCHASE_REQUEST_CONFIRM.code)
  async confirm(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseRequestService.confirm({ id, userId: user.id })
  }

  @Patch('reject/:id')
  @PermissionCode(PURCHASE_REQUEST_REJECT.code)
  async reject(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.reject({ id, userId: user.id })
  }

  @Patch('cancel/:id')
  @PermissionCode(PURCHASE_REQUEST_CANCEL.code)
  async cancel(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.cancel({ id, userId: user.id })
  }

  @Delete('delete/:id')
  @PermissionCode(PURCHASE_REQUEST_DELETE.code)
  @ApiParam({ name: 'id', example: 1 })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.deleteOne(id)
  }
}
