import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

export type UserType = {
  id: number
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
  costCenters: {
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

  async insertPermission(data: {
    permission: any[]
    groupPermission: any[]
  }): Promise<any> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.USER.INSERT_PERMISSION,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }

  async deletePermissionNotActive(): Promise<any> {
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
}
