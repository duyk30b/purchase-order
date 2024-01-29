import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsService, NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type UserType = {
  id: number
  code: string
  email: string
  username: string
  fullName: string
  phone: string
  companyId: 1
  company: {
    id: number
    name: string
    address: string
    code: string
    status: number
  }
  status: number
  costCenters?: {
    id: string
    code: string
    eName: string
    jName: string
    vName: string
    department: {
      code: string
    }
  }[]
  userWarehouses: { warehouseId: number; id: number; code: string }[]
}
@Injectable()
export class NatsClientUserService {
  constructor(private readonly natsClient: NatsClientService) {}

  async insertPermission(data: { permission: any[]; groupPermission: any[] }) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.USER.INSERT_PERMISSION,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }

  async deletePermissionNotActive() {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.USER.DELETE_PERMISSION_NOT_ACTIVE,
      {}
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }

  async getUserDetail(userId: number) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.USER.DETAIL,
      {
        id: userId,
      }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as UserType[]
  }

  async getUserListByIds(request: { userIds: number[] }) {
    const response = await this.natsClient.send(
      `${NatsService.USER}.get_users_by_ids`,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    const userList = response.data.map((user) => {
      const { userPermissions, costCenters, ...other } = user
      return other
    })
    return userList as UserType[]
  }

  async getUserMapByIds(request: { userIds: number[] }) {
    const userList = await this.getUserListByIds(request)
    const userMap: Record<string, UserType> = {}
    userList.forEach((i) => (userMap[i.id] = i))
    return userMap
  }
}
