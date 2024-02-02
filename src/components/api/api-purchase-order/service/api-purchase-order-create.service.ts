import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { FileDto } from '../../../../common/dto/file'
import { BaseResponse } from '../../../../core/interceptor/transform-response.interceptor'
import { PoDeliveryItemRepository } from '../../../../mongo/po-delivery-item/po-delivery-item.repository'
import { PoDeliveryItemInsertType } from '../../../../mongo/po-delivery-item/po-delivery-item.schema'
import { PurchaseOrderHistoryRepository } from '../../../../mongo/purchase-order-history/purchase-order-history.repository'
import { PurchaseOrderItemRepository } from '../../../../mongo/purchase-order-item/purchase-order-item.repository'
import { PurchaseOrderItemInsertType } from '../../../../mongo/purchase-order-item/purchase-order-item.schema'
import { PurchaseOrderRepository } from '../../../../mongo/purchase-order/purchase-order.repository'
import {
  PoAttachFile,
  PoPaymentStatus,
  PurchaseOrderStatus,
  PurchaseOrderType,
} from '../../../../mongo/purchase-order/purchase-order.schema'
import { FileService } from '../../../transporter/axios/file.service'
import { PurchaseOrderCreateBody } from '../request'

@Injectable()
export class ApiPurchaseOrderCreateService {
  private logger = new Logger(ApiPurchaseOrderCreateService.name)

  constructor(
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly fileService: FileService
  ) {}

  async createOne(options: {
    body: PurchaseOrderCreateBody
    files: FileDto[]
    userId: number
    status: PurchaseOrderStatus
  }): Promise<BaseResponse> {
    const { body, userId, status } = options
    const {
      files,
      poAttachFiles: poAttachFilesBody,
      poItems,
      poDeliveryItems,
      ...purchaseOrderBody
    } = body

    // await Promise.all([
    //   this.validateService.validateCostCenter(body.costCenterId),
    //   this.validateService.validateVendor(body.vendorId),
    //   this.validateService.validateItem(body.items.map((i) => i.itemId)),
    // ])

    let poAttachFiles: PoAttachFile[] = []
    if (options.files.length) {
      const filesUpload = options.files.map((f) => ({
        filename: f.originalname,
        buffer: f.buffer,
      }))

      const fileIds = await this.fileService.uploadFiles(filesUpload)
      const filesResponse = await this.fileService.getFilesByIds(fileIds)

      poAttachFiles = filesResponse.map((i, index) => {
        return {
          fileName: poAttachFilesBody[index].fileName,
          link: i.fileUrl,
          size: options.files[index].size,
          description: poAttachFilesBody[index].description,
        }
      })
    }

    const code = await this.purchaseOrderRepository.generateNextCode({})

    const purchaseOrder: PurchaseOrderType =
      await this.purchaseOrderRepository.insertOneFullField({
        ...purchaseOrderBody,
        code,
        status,
        createdByUserId: userId,
        updatedByUserId: userId,
        poPaymentStatus: PoPaymentStatus.UNPAID, // lưu tạm thế
        _total_money: new Types.Decimal128(body.totalMoney),
        _tax_money: new Types.Decimal128(body.taxMoney),
        _amount: new Types.Decimal128(body.amount),
        _delivery_expense: new Types.Decimal128(body.deliveryExpense),
        poPaymentPlans: body.poPaymentPlans.map((i) => {
          return {
            ...i,
            _amount: new Types.Decimal128(body.amount),
          }
        }),
        poAttachFiles,
      })

    const poItemsDto: PurchaseOrderItemInsertType[] = poItems.map((item) => {
      const dto: PurchaseOrderItemInsertType = {
        ...item,
        _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
        _purchase_request_item_id: new Types.ObjectId(
          item.purchaseRequestItemId
        ),
        _price: new Types.Decimal128(item.price),
        _total_money: new Types.Decimal128(item.totalMoney),
        _amount: new Types.Decimal128(item.amount),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseOrder.purchaseOrderItems =
      await this.purchaseOrderItemRepository.insertManyFullField(poItemsDto)

    const itemDeliveriesDto: PoDeliveryItemInsertType[] = poDeliveryItems.map(
      (item) => {
        const poItem = purchaseOrder.purchaseOrderItems.find((pi) => {
          return pi.purchaseRequestItemId === item.purchaseRequestItemId
        })
        const dto: PoDeliveryItemInsertType = {
          ...item,
          _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
          _purchase_order_item_id: new Types.ObjectId(poItem.id),
          createdByUserId: userId,
          updatedByUserId: userId,
        }
        return dto
      }
    )

    purchaseOrder.poDeliveryItems =
      await this.poDeliveryItemRepository.insertManyFullField(itemDeliveriesDto)

    // Lưu lịch sử
    await this.purchaseOrderHistoryRepository.insertOneFullField({
      _purchase_order_id: new Types.ObjectId(purchaseOrder.id),
      userId,
      status: { before: null, after: purchaseOrder.status },
      content: 'Tạo mới thành công',
      time: new Date(),
    })

    return { data: purchaseOrder }
  }
}
