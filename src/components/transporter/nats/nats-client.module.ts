import { Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { NatsClientService } from './nats-client.service'
import { NatsRequestService } from './nats-request/nats-request.service'
import { NatsClientIncotermService } from './nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import { NatsClientVendorService } from './nats-vendor/nats-client-vendor.service'
import { NatsConfig } from './nats.config'
import { NatsClientAttributeService } from './service/nats-client-attribute.service'
import { NatsClientAuthService } from './service/nats-client-auth.service'
import { NatsClientCostCenterService } from './service/nats-client-cost-center.service'
import { NatsClientItemService } from './service/nats-client-item.service'
import { NatsClientProduceService } from './service/nats-client-produce.service'
import { NatsClientTicketService } from './service/nats-client-ticket.service'
import { NatsClientUserService } from './service/nats-client-user.service'
import { NatsClientWarehouseLayoutService } from './service/nats-client-warehouse-layout.service'
import { NatsClientWarehouseService } from './service/nats-client-warehouse.service'

@Global()
@Module({
  providers: [
    {
      provide: 'NATS_CLIENT_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create(NatsConfig)
      },
    },
    NatsClientService,
    NatsClientAuthService,
    NatsClientTicketService,
    NatsClientWarehouseService,
    NatsClientWarehouseLayoutService,
    NatsClientItemService,
    NatsClientAttributeService,
    NatsClientUserService,
    NatsClientCostCenterService,
    NatsClientProduceService,
    NatsClientVendorService,
    NatsClientIncotermService,
    NatsRequestService,
  ],
  exports: [
    NatsClientService,
    NatsClientAuthService,
    NatsClientTicketService,
    NatsClientWarehouseService,
    NatsClientWarehouseLayoutService,
    NatsClientItemService,
    NatsClientAttributeService,
    NatsClientUserService,
    NatsClientCostCenterService,
    NatsClientProduceService,
    NatsClientVendorService,
    NatsClientIncotermService,
    NatsRequestService,
  ],
})
export class NatsClientModule {}
