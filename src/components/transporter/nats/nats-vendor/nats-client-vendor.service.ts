import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'
import {
  SupplierGetManyRequest,
  SupplierGetOneByIdRequest,
  SupplierGetOneRequest,
} from './nats-client-vendor.request'
import { SupplierType } from './nats-client-vendor.response'

@Injectable()
export class NatsClientVendorService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getManySupplier(
    request: SupplierGetManyRequest
  ): Promise<SupplierType[]> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.VENDOR.SUPPLIER_GET_MANY,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }

  async getOneSupplier(request: SupplierGetOneRequest): Promise<SupplierType> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.VENDOR.SUPPLIER_GET_ONE,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }

  async getOneByIdSupplier(
    id: string,
    options?: SupplierGetOneByIdRequest
  ): Promise<SupplierType> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.VENDOR.SUPPLIER_GET_ONE,
      <SupplierGetOneRequest>{ filter: { id }, relation: options?.relation }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }
}
