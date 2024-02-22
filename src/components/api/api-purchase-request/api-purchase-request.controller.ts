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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { IdMongoParam } from '../../../common/dto/param'
import { MultiMongoIdQuery } from '../../../common/dto/query'
import { External, TExternal } from '../../../core/decorator/request-external'
import { PermissionCode } from '../../../core/guard/authorization.guard'
import {
  PURCHASE_REQUEST_CANCEL,
  PURCHASE_REQUEST_CONFIRM,
  PURCHASE_REQUEST_CREATE,
  PURCHASE_REQUEST_DELETE,
  PURCHASE_REQUEST_DETAIL,
  PURCHASE_REQUEST_EXCHANGE,
  PURCHASE_REQUEST_HISTORY,
  PURCHASE_REQUEST_LIST,
  PURCHASE_REQUEST_REJECT,
  PURCHASE_REQUEST_UPDATE,
  PURCHASE_REQUEST_WAIT_CONFIRM,
} from '../../../core/guard/permission-purchase-request'
import { PurchaseRequestStatus } from '../../../mongo/purchase-request/purchase-request.schema'
import { ApiPurchaseRequestService } from './api-purchase-request.service'
import {
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneByIdQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'
import { ApiPrItemDetailService } from './service/api-pr-items-detail.service'
import { ApiPurchaseRequestCancelService } from './service/api-purchase-request-cancel.service'
import { ApiPurchaseRequestConfirmService } from './service/api-purchase-request-confirm.service'
import { ApiPurchaseRequestCreateService } from './service/api-purchase-request-create.service'
import { ApiPurchaseRequestDeleteService } from './service/api-purchase-request-delete.service'
import { ApiPurchaseRequestGetService } from './service/api-purchase-request-get.service'
import { ApiPurchaseRequestItemExchangeService } from './service/api-purchase-request-item-exchange.service'
import { ApiPurchaseRequestRejectService } from './service/api-purchase-request-reject.service'
import { ApiPurchaseRequestUpdateService } from './service/api-purchase-request-update.service'
import { ApiPurchaseRequestWaitConfirmService } from './service/api-purchase-request-wait-confirm.service'

@ApiTags('PurchaseRequest')
@ApiBearerAuth('access-token')
@Controller('purchase-request')
export class ApiPurchaseRequestController {
  constructor(
    private readonly apiPurchaseRequestService: ApiPurchaseRequestService,
    private readonly apiPurchaseRequestGetService: ApiPurchaseRequestGetService,
    private readonly apiPurchaseRequestCreateService: ApiPurchaseRequestCreateService,
    private readonly apiPurchaseRequestUpdateService: ApiPurchaseRequestUpdateService,
    private readonly apiPurchaseRequestDeleteService: ApiPurchaseRequestDeleteService,
    private readonly apiPurchaseRequestWaitConfirmService: ApiPurchaseRequestWaitConfirmService,
    private readonly apiPurchaseRequestConfirmService: ApiPurchaseRequestConfirmService,
    private readonly apiPurchaseRequestRejectService: ApiPurchaseRequestRejectService,
    private readonly apiPurchaseRequestCancelService: ApiPurchaseRequestCancelService,
    private readonly apiPurchaseRequestItemExchangeService: ApiPurchaseRequestItemExchangeService,
    private readonly apiPrItemDetailService: ApiPrItemDetailService
  ) {}

  @Get('pagination')
  @PermissionCode(PURCHASE_REQUEST_LIST.code)
  pagination(@Query() query: PurchaseRequestPaginationQuery) {
    return this.apiPurchaseRequestGetService.pagination(query)
  }

  @Get('list')
  @PermissionCode(PURCHASE_REQUEST_LIST.code)
  list(@Query() query: PurchaseRequestGetManyQuery) {
    return this.apiPurchaseRequestGetService.getMany(query)
  }

  @Get('detail/:id')
  @PermissionCode(PURCHASE_REQUEST_DETAIL.code)
  async detail(
    @Param() { id }: IdMongoParam,
    @Query() query: PurchaseRequestGetOneByIdQuery
  ) {
    return await this.apiPurchaseRequestGetService.getOne(id, query)
  }

  @Post('create-draft')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async createDraft(
    @External() { user }: TExternal,
    @Body() body: PurchaseRequestCreateBody
  ) {
    return await this.apiPurchaseRequestCreateService.createOne({
      body,
      userId: user.id,
      status: PurchaseRequestStatus.DRAFT,
    })
  }

  @Post('create-wait-confirm')
  @PermissionCode(PURCHASE_REQUEST_CREATE.code)
  async create(
    @External() { user }: TExternal,
    @Body() body: PurchaseRequestCreateBody
  ) {
    return await this.apiPurchaseRequestCreateService.createOne({
      body,
      userId: user.id,
      status: PurchaseRequestStatus.WAIT_CONFIRM,
    })
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
    return await this.apiPurchaseRequestWaitConfirmService.waitConfirm({
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
    return await this.apiPurchaseRequestConfirmService.confirm({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('confirm-list')
  @PermissionCode(PURCHASE_REQUEST_CONFIRM.code)
  async confirmList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseRequestConfirmService.confirm({
      ids,
      userId: user.id,
    })
  }

  @Patch('reject/:id')
  @PermissionCode(PURCHASE_REQUEST_REJECT.code)
  async reject(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestRejectService.reject({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('reject-list')
  @PermissionCode(PURCHASE_REQUEST_CONFIRM.code)
  async rejectList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseRequestRejectService.reject({
      ids,
      userId: user.id,
    })
  }

  @Patch('cancel/:id')
  @PermissionCode(PURCHASE_REQUEST_CANCEL.code)
  async cancel(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestCancelService.cancel({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('cancel-list')
  @PermissionCode(PURCHASE_REQUEST_CONFIRM.code)
  async cancelList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseRequestCancelService.cancel({
      ids,
      userId: user.id,
    })
  }

  @Delete('delete/:id')
  @PermissionCode(PURCHASE_REQUEST_DELETE.code)
  @ApiParam({ name: 'id', example: '63fdde9517a7317f0e8f959a' })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseRequestDeleteService.deleteOne(id)
  }

  @Delete('delete-list')
  @PermissionCode(PURCHASE_REQUEST_DELETE.code)
  async deleteList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseRequestDeleteService.deleteList(ids)
  }

  @Get('items-detail/:id')
  @PermissionCode(PURCHASE_REQUEST_HISTORY.code)
  @ApiParam({ name: 'id', example: '63fdde9517a7317f0e8f959a' })
  async itemsDetail(@Param() { id }: IdMongoParam) {
    return await this.apiPrItemDetailService.itemsDetail(id)
  }

  @Get('exchange/:id')
  @PermissionCode(PURCHASE_REQUEST_EXCHANGE.code)
  @ApiParam({ name: 'id', example: '65d446710785ded97447ef33' })
  @ApiQuery({ name: 'searchText', example: '123' })
  async itemsExchange(
    @Param() { id }: IdMongoParam,
    @Query() query: { searchText: string }
  ) {
    return await this.apiPurchaseRequestItemExchangeService.itemsExchange({
      purchaseRequestId: id,
      searchText: query.searchText,
    })
  }
}
