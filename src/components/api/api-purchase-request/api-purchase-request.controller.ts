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
  PURCHASE_REQUEST_HISTORY,
  PURCHASE_REQUEST_LIST,
  PURCHASE_REQUEST_REJECT,
  PURCHASE_REQUEST_UPDATE,
  PURCHASE_REQUEST_WAIT_CONFIRM,
} from '../../../core/guard/permission-purchase-request'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import {
  PurchaseRequestActionManyQuery,
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneByIdQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'
import { ApiPurchaseRequestDetailService } from './service/api-purchase-request-detail.service'
import { ApiPurchaseRequestPaginationService } from './service/api-purchase-request-pagination.service'
import { ApiPurchaseRequestUpdateService } from './service/api-purchase-request-update.service'

@ApiTags('PurchaseRequest')
@ApiBearerAuth('access-token')
@Controller('purchase-request')
export class ApiPurchaseRequestController {
  constructor(
    private readonly apiPurchaseRequestService: ApiPurchaseRequestService,
    private readonly apiPurchaseRequestDetailService: ApiPurchaseRequestDetailService,
    private readonly apiPurchaseRequestPaginationService: ApiPurchaseRequestPaginationService,
    private readonly apiPurchaseRequestUpdateService: ApiPurchaseRequestUpdateService
  ) {}

  @Get('pagination')
  @PermissionCode(PURCHASE_REQUEST_LIST.code)
  pagination(@Query() query: PurchaseRequestPaginationQuery) {
    return this.apiPurchaseRequestPaginationService.pagination(query)
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
    return await this.apiPurchaseRequestDetailService.getOne(id, query)
  }

  @Post('create-draft')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async createDraft(
    @External() { user }: TExternal,
    @Body() body: PurchaseRequestCreateBody
  ) {
    return await this.apiPurchaseRequestService.createDraft(body, user.id)
  }

  @Post('create-wait-confirm')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async create(
    @External() { user }: TExternal,
    @Body() body: PurchaseRequestCreateBody
  ) {
    return await this.apiPurchaseRequestService.createWaitConfirm(body, user.id)
  }

  @Patch('update/:id')
  @PermissionCode(PURCHASE_REQUEST_UPDATE.code)
  async update(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam,
    @Body() body: PurchaseRequestUpdateBody
  ) {
    return await this.apiPurchaseRequestUpdateService.updateOne({
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

  // @Patch('confirm-list')
  // @PermissionCode(PURCHASE_REQUEST_CONFIRM.code)
  // async confirmList(
  //   @External() { user }: TExternal,
  //   @Query() query: PurchaseRequestActionManyQuery
  // ) {
  //   return await this.apiPurchaseRequestService.confirm({ id, userId: user.id })
  // }

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
  @ApiParam({ name: 'id', example: '63fdde9517a7317f0e8f959a' })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.deleteOne(id)
  }

  @Get('history/:id')
  @PermissionCode(PURCHASE_REQUEST_HISTORY.code)
  @ApiParam({ name: 'id', example: '63fdde9517a7317f0e8f959a' })
  async history(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestService.history(id)
  }
}
