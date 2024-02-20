import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { NatsSubject } from '../../transporter/nats/nats.config'
import { NatsPurchaseRequestService } from './nats-purchased-request.service'
import { PurchaseRequestGetManyQuery } from './request/purchased-request-get.query'

@ApiTags('Nats PurchaseRequest')
@ApiBearerAuth('access-token')
@Controller()
export class NatsPurchaseRequestController {
  constructor(
    private readonly natsPurchaseRequestService: NatsPurchaseRequestService
  ) {}

  @MessagePattern(
    NatsSubject.PURCHASED_REQUEST.GET_PURCHASED_REQUEST_LIST,
    Transport.NATS
  )
  getMany(@Payload() payload: PurchaseRequestGetManyQuery) {
    return this.natsPurchaseRequestService.getMany(payload)
  }
}
