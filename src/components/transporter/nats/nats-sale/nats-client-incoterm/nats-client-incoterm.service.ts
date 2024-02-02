import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../../nats-client.service'
import { NatsSubject } from '../../nats.config'
import { NatsResponseInterface } from '../../nats.interface'
import {
  IncotermGetManyRequest,
  IncotermGetOneByIdRequest,
  IncotermGetOneRequest,
} from './nats-client-incoterm.request'
import { IncotermType } from './nats-client-incoterm.response'

@Injectable()
export class NatsClientIncotermService {
  private readonly logger = new Logger(NatsClientIncotermService.name)
  constructor(private readonly natsClient: NatsClientService) {}

  async incotermGetOne(request: IncotermGetOneRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.SALE.INCOTERM_GET_ONE,
      request
    )
    if (response.statusCode !== 200) {
      this.logger.error(JSON.stringify(response))
      throw new BusinessException(response.message as any)
    }
    return response.data as IncotermType
  }

  async incotermGetOneById(id: number, options?: IncotermGetOneByIdRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.SALE.INCOTERM_GET_ONE,
      <IncotermGetOneRequest>{ filter: { id }, relation: options?.relation }
    )
    if (response.statusCode !== 200) {
      this.logger.error(JSON.stringify(response))
      throw new BusinessException(response.message as any)
    }
    return response.data as IncotermType
  }

  async incotermGetList(request: IncotermGetManyRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.SALE.INCOTERM_GET_MANY,
      request
    )
    if (response.statusCode !== 200) {
      this.logger.error(JSON.stringify(response))
      throw new BusinessException(response.message as any)
    }
    return response.data as IncotermType[]
  }

  async incotermGetMap(request: IncotermGetManyRequest) {
    const supplierList = await this.incotermGetList(request)
    const supplierMap: Record<string, IncotermType> = {}
    supplierList.forEach((i) => (supplierMap[i.id] = i))
    return supplierMap
  }
}
