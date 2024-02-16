import { Injectable, Logger } from '@nestjs/common'
import { customFilter } from '../../../common/helpers'
import { BaseResponse } from '../../../core/interceptor/transform-response.interceptor'
import { UserActionRepository } from '../../../mongo/user-action/user-action.repository'
import { UserActionKey } from '../../../mongo/user-action/user-action.schema'
import { NatsClientUserService } from '../../transporter/nats/service/nats-client-user.service'
import { UserActionGetManyQuery } from './request/user-action-get.query'

@Injectable()
export class ApiUserActionService {
  private logger = new Logger(ApiUserActionService.name)

  constructor(
    private readonly userActionRepository: UserActionRepository,
    private readonly natsClientUserService: NatsClientUserService
  ) {}

  async searchUserCreatePO(
    query: UserActionGetManyQuery
  ): Promise<BaseResponse> {
    const { limit, filter, relation } = query

    const data = await this.userActionRepository.findMany({
      relation,
      condition: {
        key: UserActionKey.CREATE_PO,
      },
      limit,
    })
    if (data.length === 0) {
      return { data: { userList: [] } }
    }
    const userIdList = data.map((i) => i.userId)
    let userList = await this.natsClientUserService.getUserListByIds({
      userIds: userIdList,
    })

    if (filter?.searchText) {
      userList = userList.filter((u) => {
        return (
          customFilter(u.code, filter.searchText, 0) ||
          customFilter(u.fullName, filter.searchText, 0)
        )
      })
    }

    return { data: { userList } }
  }
}
