import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { FileDto } from '../../../../common/dto/file'
import { arrayToKeyValue, uniqueArray } from '../../../../common/helpers'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
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
import { PurchaseRequestRepository } from '../../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../../mongo/purchase-request/purchase-request.schema'
import { UserActionRepository } from '../../../../mongo/user-action/user-action.repository'
import { UserActionKey } from '../../../../mongo/user-action/user-action.schema'
import { FileService } from '../../../transporter/axios/file.service'
import { IncotermType } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.response'
import { NatsClientIncotermService } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import {
  SUPPLIER_STATUS,
  SupplierType,
} from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  ItemActiveStatusEnum,
  ItemType,
  ItemUnitType,
  NatsClientItemService,
} from '../../../transporter/nats/service/nats-client-item.service'
import {
  NatsClientWarehouseService,
  WarehouseType,
} from '../../../transporter/nats/service/nats-client-warehouse.service'
import { PurchaseOrderCreateBody } from '../request'

@Injectable()
export class ApiPurchaseOrderCreateService {
  private logger = new Logger(ApiPurchaseOrderCreateService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly userActionRepository: UserActionRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientIncotermService: NatsClientIncotermService,
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
      purchaseRequestId,
      ...purchaseOrderBody
    } = body

    await this.validate([body])

    let poAttachFiles: PoAttachFile[] = []
    if (options.files.length) {
      options.files.forEach((i) => {
        // 5MB
        if (i.size > 5_000_000) {
          throw new BusinessException('msg.MSG_149')
        }
      })
      const filesUpload = options.files.map((f) => ({
        filename: f.originalname,
        buffer: f.buffer,
      }))

      const fileIds = await this.fileService.uploadFiles(filesUpload)
      const filesResponse = await this.fileService.getFilesByIds(fileIds)

      poAttachFiles = filesResponse.map((i, index) => {
        return {
          fileId: i.id,
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
        _purchase_request_id: new Types.ObjectId(body.purchaseRequestId),
        code,
        status,
        createdByUserId: userId,
        updatedByUserId: userId,
        poPaymentStatus: PoPaymentStatus.UNPAID, // lưu tạm thế
        _total_money: new Types.Decimal128(body.totalMoney),
        _tax_money: new Types.Decimal128(body.taxMoney),
        _amount: new Types.Decimal128(body.amount),
        _delivery_expense: body?.deliveryExpense
          ? new Types.Decimal128(body?.deliveryExpense)
          : null,
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

    await this.userActionRepository.upsertOne(
      { key: UserActionKey.CREATE_PO, userId },
      { key: UserActionKey.CREATE_PO, userId }
    )

    return { data: purchaseOrder, message: 'msg.MSG_012' }
  }

  async validate(data: PurchaseOrderCreateBody[]) {
    const supplierIds = data.map((i) => i.supplierId)

    const purchaseOrderItems = data.map((i) => i.poItems || []).flat()
    const poDeliveryItems = data.map((i) => i.poDeliveryItems || []).flat()
    const poPaymentPlans = data.map((i) => i.poPaymentPlans || []).flat()

    const incotermIds = data.map((i) => i.incotermId)
    const purchaseRequestCodes = data.map((i) => i.purchaseRequestCode)
    const contractCodes = data.map((i) => i.contractCode) // mã hợp đồng

    const itemIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemId),
      ...(poDeliveryItems || []).map((i) => i.itemId),
    ])
    const itemUnitIdList = uniqueArray([
      ...(purchaseOrderItems || []).map((i) => i.itemUnitId),
      ...(poDeliveryItems || []).map((i) => i.itemUnitId),
    ])
    const deliveryMethodList = data.map((i) => i.deliveryMethod) // phương thức vận chuyển
    const paymentMethodList = poPaymentPlans.map((i) => i.paymentMethod) // phương thức thanh toán
    const warehouseIdList = poDeliveryItems.map((i) => i.warehouseIdReceiving) // kho nhận

    const dataExtendsPromise = await Promise.allSettled([
      supplierIds.length
        ? this.natsClientVendorService.getSupplierMap({
            filter: { id: { IN: supplierIds } },
            relation: { supplierItems: true },
          })
        : {},
      incotermIds && incotermIds.length
        ? this.natsClientIncotermService.incotermGetMap({
            filter: { id: { IN: incotermIds } },
          })
        : {},
      purchaseRequestCodes && purchaseRequestCodes.length
        ? this.purchaseRequestRepository.findManyBy({
            code: { IN: purchaseRequestCodes },
          })
        : [],
      itemIdList && itemIdList.length
        ? this.natsClientItemService.getItemMapByIds({ itemIds: itemIdList })
        : {},
      itemUnitIdList && itemUnitIdList.length
        ? this.natsClientItemService.getItemUnitListByIds({
            unitIds: itemUnitIdList,
          })
        : {},
      warehouseIdList && warehouseIdList.length
        ? this.natsClientWarehouseService.getWarehouseList({
            ids: warehouseIdList,
          })
        : {},
    ])
    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return []
      }
    }) as [
      Record<string, SupplierType>,
      Record<string, IncotermType>,
      PurchaseRequestType[],
      Record<string, ItemType>,
      ItemUnitType[],
      WarehouseType[],
    ]

    const [
      supplierMap,
      incotermMap,
      purchaseRequestList,
      itemMap,
      itemUnitList,
      warehouseList,
    ] = dataExtendsResult
    const itemList = Object.values(itemMap)
    const purchaseRequestMap = arrayToKeyValue(purchaseRequestList, 'code')

    data.forEach((po) => {
      const supplier = supplierMap[po.supplierId]
      if (!supplier || ![SUPPLIER_STATUS.ACTIVE].includes(supplier.status)) {
        throw new BusinessException('msg.MSG_045')
      }
      const supplierItemList = supplier.supplierItems || []
      const supplierItemMap = arrayToKeyValue(supplierItemList, 'itemId')

      const pr = purchaseRequestMap[po.purchaseRequestCode]
      if (!pr || ![PurchaseRequestStatus.CONFIRM].includes(pr.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }

      const incoterm = incotermMap[po.incotermId]
      if (!incoterm || !incoterm.isActive) {
        throw BusinessException.msg('msg.MSG_195', { obj: 'Incoterms' })
      }

      po.poItems.forEach((poItem) => {
        const item = itemMap[poItem.itemId]
        const supplierItem = supplierItemMap[poItem.itemId]
        if (![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)) {
          throw new BusinessException('msg.MSG_195', {
            obj: 'Sản phẩm',
          })
        }
        // if (poItem.itemUnitId !== supplierItem.itemUnitId) {
        //   throw new BusinessException('msg.MSG_298', {
        //     obj: 'Sản phẩm',
        //   })
        // }

        // TODO: Tổng SL giao kế hoạch khác SL mua: Thông báo mã lỗi MSG_ 059
      })
    })

    // TODO: Hợp đồng không ở trạng thái xác nhận: Thông báo mã lỗi MSG_010 {Hợp đồng}
    // TODO: Phương thức vận chuyển không hoạt động: thông báo mã lỗi MSG_056
    // TODO: Tổng SL giao kế hoạch khác SL mua: Thông báo mã lỗi MSG_ 059
    // TODO:  + Phương thức thanh toán không hoạt động: thông báo mã lỗi MSG_060
  }
}
