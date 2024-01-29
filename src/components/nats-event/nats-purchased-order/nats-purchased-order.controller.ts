import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { NatsSubject } from '../../transporter/nats/nats.config'
import { NatsPurchaseOrderService } from './nats-purchased-order.service'
import { PurchaseOrderGetManyRequest } from './request/purchase-order-get.query'

@ApiTags('PurchaseOrder')
@ApiBearerAuth('access-token')
@Controller('customer')
export class NatsPurchaseOrderController {
  constructor(
    private readonly natsPurchaseOrderService: NatsPurchaseOrderService
  ) {}

  @MessagePattern(
    NatsSubject.PURCHASE_ORDER.GET_PURCHASED_ORDER_LIST,
    Transport.NATS
  )
  getMany(@Payload() payload: PurchaseOrderGetManyRequest) {
    return this.natsPurchaseOrderService.getMany(payload)
  }
}
