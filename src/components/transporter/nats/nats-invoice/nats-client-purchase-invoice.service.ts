import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'
import { PurchaseInvoiceGetManyRequest } from './nats-client-purchase-invoice.request'
import { PurchaseInvoiceType } from './nats-client-purchase-invoice.response'

@Injectable()
export class NatsClientPurchaseInvoiceService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getPurchaseInvoiceList(request: PurchaseInvoiceGetManyRequest) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.INVOICE.GET_PURCHASE_INVOICE_LIST,
      request
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data as PurchaseInvoiceType[]
  }

  async getPurchaseInvoiceMap(request: PurchaseInvoiceGetManyRequest) {
    const supplierList = await this.getPurchaseInvoiceList(request)
    const supplierMap: Record<string, PurchaseInvoiceType> = {}
    supplierList.forEach((i) => (supplierMap[i.id] = i))
    return supplierMap
  }
}
