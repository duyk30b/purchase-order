import { Controller, Get } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { NatsSubject } from '../../transporter/nats/nats.config'
import { NatsPurchaseOrderService } from './nats-purchased-order.service'
import { PurchaseOrderGetManyRequest } from './request/purchase-order-get.query'

@ApiTags('Nats PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller()
export class NatsPurchaseOrderController {
  constructor(
    private readonly natsPurchaseOrderService: NatsPurchaseOrderService
  ) {}

  @MessagePattern(
    NatsSubject.PURCHASE_ORDER.GET_PURCHASED_ORDER_LIST,
    Transport.NATS
  )
  async getMany(@Payload() payload: PurchaseOrderGetManyRequest) {
    return await this.natsPurchaseOrderService.getMany(payload)
  }

  @Get('test')
  async test() {
    return await this.natsPurchaseOrderService.getMany({
      filter: { code: { IN: ['PO-0000004'] } },
    } as any)
  }
}
