import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { FileDto } from '../../../../common/dto/file'
import { uniqueArray } from '../../../../common/helpers'
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
import { FileService } from '../../../transporter/axios/file.service'
import { IncotermType } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.response'
import { NatsClientIncotermService } from '../../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import {
  SUPPLIER_STATUS,
  SupplierItemType,
} from '../../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../../transporter/nats/nats-vendor/nats-client-vendor.service'
import { NatsClientCostCenterService } from '../../../transporter/nats/service/nats-client-cost-center.service'
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
import { PurchaseOrderUpdateBody } from '../request'

@Injectable()
export class ApiPurchaseOrderUpdateService {
  private logger = new Logger(ApiPurchaseOrderUpdateService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseOrderRepository: PurchaseOrderRepository,
    private readonly purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private readonly poDeliveryItemRepository: PoDeliveryItemRepository,
    private readonly purchaseOrderHistoryRepository: PurchaseOrderHistoryRepository,
    private readonly fileService: FileService,
    private readonly userActionRepository: UserActionRepository,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientIncotermService: NatsClientIncotermService
  ) {}

  async update(options: {
    id: string
    body: PurchaseOrderUpdateBody
    files: FileDto[]
    userId: number
  }): Promise<BaseResponse> {
    const { id, body, userId } = options
    const {
      files,
      poAttachFiles: poAttachFilesBody,
      poItems,
      poDeliveryItems,
      purchaseRequestId,
      ...purchaseOrderBody
    } = body

    await this.validate([body])

    const rootData = await this.purchaseOrderRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.WAIT_CONFIRM,
        PurchaseOrderStatus.REJECT,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PurchaseRequest.StatusInvalid')
    }

    let status: PurchaseOrderStatus
    if (rootData.status === PurchaseOrderStatus.DRAFT) {
      status = PurchaseOrderStatus.DRAFT
    } else if (rootData.status === PurchaseOrderStatus.WAIT_CONFIRM) {
      status = PurchaseOrderStatus.WAIT_CONFIRM
    } else if (rootData.status === PurchaseOrderStatus.REJECT) {
      status = PurchaseOrderStatus.WAIT_CONFIRM
    }

    const poAttachFilesInsert: PoAttachFile[] = []
    const poAttachFilesUpdate: PoAttachFile[] = []
    const poAttachFilesDelete: PoAttachFile[] = rootData.poAttachFiles // ban đầu thì cứ mặc định xóa hết

    if (poAttachFilesBody.length) {
      poAttachFilesBody.forEach((i) => {
        // Nếu có id thì chuyển file đó sang dạng update
        if (i.fileId) {
          const indexUpdate = poAttachFilesDelete.findIndex((j) => {
            return j.fileId === i.fileId
          })
          if (indexUpdate === -1) {
            throw new BusinessException('error.NOT_FOUND')
          }
          const updateFile = poAttachFilesDelete[indexUpdate]
          updateFile.description = i.description
          updateFile.fileName = i.fileName

          poAttachFilesUpdate.push(updateFile)
          poAttachFilesDelete.splice(indexUpdate, 1)
        } else {
          poAttachFilesInsert.push({
            fileId: '',
            link: '',
            fileName: i.fileName,
            description: i.description,
            size: 0,
          })
        }
      })
    }

    if (options.files.length && poAttachFilesInsert.length) {
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

      filesResponse.forEach((i, index) => {
        poAttachFilesInsert[index].fileId = i.id
        poAttachFilesInsert[index].link = i.fileUrl
        poAttachFilesInsert[index].size = options.files[index].size
      })
    }

    // TODO
    // Xóa file cũ (file service chưa hỗ trợ)

    const purchaseOrder: PurchaseOrderType =
      await this.purchaseOrderRepository.updateOne(
        { id },
        {
          ...purchaseOrderBody,
          _purchase_request_id: new Types.ObjectId(body.purchaseRequestId),
          status,
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
          poAttachFiles: [...poAttachFilesInsert, ...poAttachFilesUpdate],
        }
      )

    const deletePoItems = await this.purchaseOrderItemRepository.deleteManyBy({
      _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
    })
    const deletePoDeliveryItems =
      await this.poDeliveryItemRepository.deleteManyBy({
        _purchase_order_id: { EQUAL: new Types.ObjectId(id) },
      })

    const itemsDto: PurchaseOrderItemInsertType[] = poItems.map((item) => {
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
      await this.purchaseOrderItemRepository.insertManyFullField(itemsDto)

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
      content: 'Chỉnh sửa phiếu mua',
      time: new Date(),
    })

    return { data: purchaseOrder }
  }

  async validate(data: PurchaseOrderUpdateBody[]) {
    const supplierIds = data.map((i) => i.supplierId)
    const supplierMap = supplierIds.length
      ? await this.natsClientVendorService.getSupplierMap({
          filter: { id: { IN: supplierIds } },
          relation: { supplierItems: true },
        })
      : {}
    const supplierList = Object.values(supplierMap)
    supplierList.forEach((i) => {
      if (![SUPPLIER_STATUS.ACTIVE].includes(i.status)) {
        throw new BusinessException('msg.MSG_045')
      }
    })

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
      incotermIds && incotermIds.length
        ? this.natsClientIncotermService.incotermGetList({
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
      IncotermType[],
      PurchaseRequestType[],
      Record<string, ItemType>,
      ItemUnitType[],
      WarehouseType[],
    ]

    const [
      incotermList,
      purchaseRequestList,
      itemMap,
      itemUnitList,
      warehouseList,
    ] = dataExtendsResult
    const itemList = Object.values(itemMap)

    incotermList.forEach((i) => {
      if (!i.isActive) {
        throw BusinessException.msg('msg.MSG_195', { obj: 'Incoterms' })
      }
    })
    purchaseRequestList.forEach((i) => {
      if (![PurchaseRequestStatus.CONFIRM].includes(i.status)) {
        throw new BusinessException('msg.MSG_010', { obj: 'Yêu cầu mua hàng' })
      }
    })

    // check từng item của PO
    data.forEach((body: PurchaseOrderUpdateBody) => {
      const supplier = supplierMap[body.supplierId]
      const supplierItemList = supplier.supplierItems || []
      const supplierItemMap: Record<string, SupplierItemType> = {}
      supplierItemList.forEach((i) => (supplierItemMap[i.id] = i))

      body.poItems.forEach((poItem) => {
        const item = itemMap[poItem.itemId]
        const supplierItem = supplierItemMap[poItem.itemId]
        if (![ItemActiveStatusEnum.ACTIVE].includes(item.activeStatus)) {
          throw new BusinessException('msg.MSG_195', {
            obj: 'Sản phẩm',
          })
        }
        if (poItem.itemUnitId !== supplierItem.itemUnitId) {
          throw new BusinessException('msg.MSG_298', {
            obj: 'Sản phẩm',
          })
        }

        // TODO: Tổng SL giao kế hoạch khác SL mua: Thông báo mã lỗi MSG_ 059
      })

      // TODO: Phương thức vận chuyển không hoạt động: thông báo mã lỗi MSG_056
      // TODO: Phương thức thanh toán không hoạt động: thông báo mã lỗi MSG_060
    })
  }
}
