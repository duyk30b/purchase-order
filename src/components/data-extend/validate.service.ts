import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../core/exception-filter/exception-filter'
import { PurchaseRequestType } from '../../mongo/purchase-request/purchase-request.schema'
import {
  CostCenterStatusEnum,
  NatsClientCostCenterService,
} from '../transporter/nats/service/nats-client-cost-center.service'
import { NatsClientItemService } from '../transporter/nats/service/nats-client-item.service'
import { NatsClientUserService } from '../transporter/nats/service/nats-client-user.service'
import { NatsClientWarehouseService } from '../transporter/nats/service/nats-client-warehouse.service'

@Injectable()
export class ValidateService {
  private logger = new Logger(ValidateService.name)
  constructor(
    private readonly natsClientUserService: NatsClientUserService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService
  ) {}

  async validateCostCenter(costCenterId: string) {
    const costCenterMap = await this.natsClientCostCenterService.getCostCenterMap({
      ids: [costCenterId],
    })
    const costCenter = costCenterMap[costCenterId]
    if (!costCenter) {
      throw new BusinessException('error.CostCenter.Error')
    }
    if (
      [
        CostCenterStatusEnum.DRAFT,
        CostCenterStatusEnum.DELETED,
        CostCenterStatusEnum.INACTIVE,
      ].includes(costCenter.status)
    ) {
      throw new BusinessException('error.CostCenter.Error')
    }
  }

  async validateVendor(vendorId: string) {
    return vendorId
  }

  async validateItem(itemIds: number[]) {
    return itemIds
  }
}
