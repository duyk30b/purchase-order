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
import { ApiPurchaseOrderService } from './api-purchase-order.service'
import {
  PurchaseOrderCreateBody,
  PurchaseOrderGetManyQuery,
  PurchaseOrderGetOneQuery,
  PurchaseOrderPaginationQuery,
  PurchaseOrderUpdateBody,
} from './request'
import { ApiPurchaseOrderDetailService } from './service/api-purchase-order-detail.service'
import { ApiPurchaseOrderPaginationService } from './service/api-purchase-order-pagination.service'

@ApiTags('PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller('customer')
export class ApiPurchaseOrderController {
  constructor(
    private readonly apiPurchaseOrderService: ApiPurchaseOrderService,
    private readonly apiPurchaseOrderPaginationService: ApiPurchaseOrderPaginationService,
    private readonly apiPurchaseOrderDetailService: ApiPurchaseOrderDetailService
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

  @Post('create')
  async create(@Body() body: PurchaseOrderCreateBody) {
    return await this.apiPurchaseOrderService.createOne(body)
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
