import { Injectable, Logger } from '@nestjs/common'
import { PurchaseRequestType } from '../../mongo/purchase-request/purchase-request.schema'
import { NatsClientCostCenterService } from '../transporter/nats/service/nats-client-cost-center.service'
import { NatsClientItemService } from '../transporter/nats/service/nats-client-item.service'
import { NatsClientUserService } from '../transporter/nats/service/nats-client-user.service'
import { NatsClientWarehouseService } from '../transporter/nats/service/nats-client-warehouse.service'

@Injectable()
export class InformationService {
  private logger = new Logger(InformationService.name)
  constructor(
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async getInformationFromPurchaseRequest(data: PurchaseRequestType[]) {}
}
