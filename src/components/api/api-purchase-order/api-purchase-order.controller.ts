import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger'
import { FileDto } from '../../../common/dto/file'
import { IdMongoParam } from '../../../common/dto/param'
import { MultiMongoIdQuery } from '../../../common/dto/query'
import { External, TExternal } from '../../../core/decorator/request-external'
import { PermissionCode } from '../../../core/guard/authorization.guard'
import {
  PURCHASE_ORDER_CANCEL,
  PURCHASE_ORDER_CONFIRM,
  PURCHASE_ORDER_CREATE,
  PURCHASE_ORDER_DELETE,
  PURCHASE_ORDER_DETAIL,
  PURCHASE_ORDER_LIST,
  PURCHASE_ORDER_REJECT,
  PURCHASE_ORDER_SUCCESS,
  PURCHASE_ORDER_UPDATE,
  PURCHASE_ORDER_WAIT_CONFIRM,
  PURCHASE_ORDER_WAIT_DELIVERY,
} from '../../../core/guard/permission-purchase-order'
import { FastifyFilesInterceptor } from '../../../core/interceptor/fastify-files-interceptor'
import { PurchaseOrderStatus } from '../../../mongo/purchase-order/purchase-order.schema'
import {
  PurchaseOrderActionManyQuery,
  PurchaseOrderCreateBody,
  PurchaseOrderGetManyQuery,
  PurchaseOrderGetOneQuery,
  PurchaseOrderPaginationQuery,
  PurchaseOrderUpdateBody,
} from './request'
import { ApiPurchaseOrderCancelService } from './service/api-purchase-order-cancel.service'
import { ApiPurchaseOrderConfirmService } from './service/api-purchase-order-confirm.service'
import { ApiPurchaseOrderCreateService } from './service/api-purchase-order-create.service'
import { ApiPurchaseOrderDeleteService } from './service/api-purchase-order-delete.service'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderListService } from './service/api-purchase-order-list.service'
import { ApiPurchaseOrderRejectService } from './service/api-purchase-order-reject.service'
import { ApiPurchaseOrderSuccessService } from './service/api-purchase-order-success.service'
import { ApiPurchaseOrderUpdateService } from './service/api-purchase-order-update.service'
import { ApiPurchaseOrderWaitConfirmService } from './service/api-purchase-order-wait-confirm.service'
import { ApiPurchaseOrderWaitDeliveryService } from './service/api-purchase-order-wait-delivery.service'

@ApiTags('PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller('purchase-order')
export class ApiPurchaseOrderController {
  constructor(
    private readonly apiPurchaseOrderListService: ApiPurchaseOrderListService,
    private readonly apiPurchaseOrderDetailService: ApiPurchaseOrderDetailService,
    private readonly apiPurchaseOrderCreateService: ApiPurchaseOrderCreateService,
    private readonly apiPurchaseOrderUpdateService: ApiPurchaseOrderUpdateService,
    private readonly apiPurchaseOrderDeleteService: ApiPurchaseOrderDeleteService,
    private readonly apiPurchaseOrderWaitConfirmService: ApiPurchaseOrderWaitConfirmService,
    private readonly apiPurchaseOrderRejectService: ApiPurchaseOrderRejectService,
    private readonly apiPurchaseOrderConfirmService: ApiPurchaseOrderConfirmService,
    private readonly apiPurchaseOrderCancelService: ApiPurchaseOrderCancelService,
    private readonly apiPurchaseOrderSuccessService: ApiPurchaseOrderSuccessService,
    private readonly apiPurchaseOrderWaitDeliveryService: ApiPurchaseOrderWaitDeliveryService
  ) {}

  // @ApiConsumes('multipart/form-data')
  // @Post('single-file')
  // @UseInterceptors(FastifyFileInterceptor('photo_url', {}))
  // uploadSingleFile(@UploadedFile() file: any, @Body() body: SingleFileDto) {
  //   console.log('🚀 ~ ApiPurchaseOrderController ~ body:', body)
  //   console.log('🚀 ~ ApiPurchaseOrderController ~ file:', file)
  //   return { ...body }
  // }

  // @ApiConsumes('multipart/form-data')
  // @Post('multiple-file')
  // @UseInterceptors(FastifyFilesInterceptor('photo_url', 10, {}))
  // uploadMultipleFile(
  //   @UploadedFiles() files: any[],
  //   @Body() body: MultipleFileDto
  // ) {
  //   console.log('🚀 ~ ApiPurchaseOrderController ~ body:', body)
  //   console.log('🚀 ~ ApiPurchaseOrderController ~ file:', files)
  //   return { ...body }
  // }

  @Get('pagination')
  @PermissionCode(PURCHASE_ORDER_LIST.code)
  pagination(@Query() query: PurchaseOrderPaginationQuery) {
    return this.apiPurchaseOrderListService.pagination(query)
  }

  @Get('list')
  @PermissionCode(PURCHASE_ORDER_LIST.code)
  list(@Query() query: PurchaseOrderGetManyQuery) {
    return this.apiPurchaseOrderListService.getMany(query)
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FastifyFilesInterceptor('files', 10, {}))
  async createDraft(
    @External() { user }: TExternal,
    @UploadedFiles() files: FileDto[],
    @Body() body: PurchaseOrderCreateBody
  ) {
    return await this.apiPurchaseOrderCreateService.createOne({
      files,
      body,
      userId: user.id,
      status: PurchaseOrderStatus.DRAFT,
    })
  }

  @Post('create-wait-confirm')
  @PermissionCode(PURCHASE_ORDER_CREATE.code)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FastifyFilesInterceptor('files', 10, {}))
  async createWaitConfirm(
    @External() { user }: TExternal,
    @UploadedFiles() files: FileDto[],
    @Body() body: PurchaseOrderCreateBody
  ) {
    return await this.apiPurchaseOrderCreateService.createOne({
      body,
      files,
      userId: user.id,
      status: PurchaseOrderStatus.WAIT_CONFIRM,
    })
  }

  @Patch('update/:id')
  @PermissionCode(PURCHASE_ORDER_UPDATE.code)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FastifyFilesInterceptor('files', 10, {}))
  async update(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam,
    @UploadedFiles() files: FileDto[],
    @Body() body: PurchaseOrderUpdateBody
  ) {
    return await this.apiPurchaseOrderUpdateService.update({
      id,
      body,
      files,
      userId: user.id,
    })
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
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('confirm-list')
  @PermissionCode(PURCHASE_ORDER_CANCEL.code)
  async confirmList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseOrderConfirmService.confirm({
      ids,
      userId: user.id,
    })
  }

  @Patch('reject/:id')
  @PermissionCode(PURCHASE_ORDER_REJECT.code)
  async reject(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderRejectService.reject({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('reject-list')
  @PermissionCode(PURCHASE_ORDER_REJECT.code)
  async rejectList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseOrderRejectService.reject({
      ids,
      userId: user.id,
    })
  }

  @Patch('cancel/:id')
  @PermissionCode(PURCHASE_ORDER_CANCEL.code)
  async cancel(@External() { user }: TExternal, @Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderCancelService.cancel({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('cancel-list')
  @PermissionCode(PURCHASE_ORDER_CANCEL.code)
  async cancelList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseOrderCancelService.cancel({
      ids,
      userId: user.id,
    })
  }

  @Patch('success/:id')
  @PermissionCode(PURCHASE_ORDER_SUCCESS.code)
  async success(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseOrderSuccessService.success({
      id,
      userId: user.id,
    })
  }

  @Patch('wait-delivery/:id')
  @PermissionCode(PURCHASE_ORDER_WAIT_DELIVERY.code)
  async waitDelivery(
    @External() { user }: TExternal,
    @Param() { id }: IdMongoParam
  ) {
    return await this.apiPurchaseOrderWaitDeliveryService.waitDelivery({
      ids: [id],
      userId: user.id,
    })
  }

  @Patch('wait-delivery-list')
  @PermissionCode(PURCHASE_ORDER_WAIT_DELIVERY.code)
  async waitDeliveryList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseOrderWaitDeliveryService.waitDelivery({
      ids,
      userId: user.id,
    })
  }

  @Delete('delete/:id')
  @PermissionCode(PURCHASE_ORDER_DELETE.code)
  @ApiParam({ name: 'id', example: 1 })
  async deleteOne(@Param() { id }: IdMongoParam) {
    return await this.apiPurchaseOrderDeleteService.delete([id])
  }

  @Delete('delete-list')
  @PermissionCode(PURCHASE_ORDER_CANCEL.code)
  async deleteList(
    @External() { user }: TExternal,
    @Query() { ids }: MultiMongoIdQuery
  ) {
    return await this.apiPurchaseOrderDeleteService.delete(ids)
  }
}
