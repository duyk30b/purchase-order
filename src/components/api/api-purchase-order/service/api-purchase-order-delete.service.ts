import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import { PurchaseOrderStatus } from '../../../../mongo/purchase-order/purchase-order.schema'

@Injectable()
export class ApiPurchaseOrderDeleteService {
  private logger = new Logger(ApiPurchaseOrderDeleteService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository
  ) {}

  async deleteOne(id: string): Promise<BaseResponse> {
    const rootData = await this.purchaseOrderRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseOrderStatus.DRAFT].includes(rootData.status)) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    const deletePo = await this.purchaseOrderRepository.deleteOneBy({
      id,
    } as any)
    const deletePoItems = await this.purchaseOrderItemRepository.deleteManyBy({
      _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
    })
    const deletePoDeliveryItems =
      await this.poDeliveryItemRepository.deleteManyBy({
        _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
      })
    return { data: id }
  }
}
