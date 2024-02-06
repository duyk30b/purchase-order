import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PermissionCode } from '../../../core/guard/authorization.guard'
import { PURCHASE_ORDER_LIST } from '../../../core/guard/permission-purchase-order'
import { ApiUserActionService } from './api-user-action.service'
import { UserActionGetManyQuery } from './request/user-action-get.query'

@ApiTags('UserAction')
@ApiBearerAuth('access-token')
@Controller('user-action')
export class ApiUserActionController {
  constructor(private readonly apiUserActionService: ApiUserActionService) {}

  @Get('search-user-create-po')
  @PermissionCode(PURCHASE_ORDER_LIST.code)
  searchUserCreatePO(@Query() query: UserActionGetManyQuery) {
    return this.apiUserActionService.searchUserCreatePO(query)
  }
}
