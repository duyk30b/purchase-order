import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../core/exception-filter/exception-filter'
import { ResponseBuilderType } from '../../../core/interceptor/transform-response.interceptor'
import { PurchaseRequestHistoryRepository } from '../../../mongo/purchase-request-history/purchase-request-history.repository'
import { PurchaseRequestItemRepository } from '../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemInsertType } from '../../../mongo/purchase-request-item/purchase-request-item.schema'
import { PurchaseRequestRepository } from '../../../mongo/purchase-request/purchase-request.repository'
import {
  PurchaseRequestStatus,
  PurchaseRequestType,
} from '../../../mongo/purchase-request/purchase-request.schema'
import { InformationService } from '../../data-extend/information.service'
import { ValidateService } from '../../data-extend/validate.service'
import {
  PurchaseRequestCreateBody,
  PurchaseRequestGetManyQuery,
  PurchaseRequestGetOneByIdQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'

@Injectable()
export class ApiPurchaseRequestService {
  private logger = new Logger(ApiPurchaseRequestService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly purchaseRequestHistoryRepository: PurchaseRequestHistoryRepository,
    private readonly informationService: InformationService,
    private readonly validateService: ValidateService
  ) {}

  async pagination(
    query: PurchaseRequestPaginationQuery
  ): Promise<ResponseBuilderType> {
    const { page, limit, filter, sort, relation } = query

    const { total, data } = await this.purchaseRequestRepository.pagination({
      page,
      limit,
      relation,
      condition: {
        code: filter.searchText ? { LIKE: filter.searchText } : undefined,
        // code: filter.code,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      sort: sort || { _id: 'DESC' },
    })

    const dataExtend =
      await this.informationService.getInformationFromPurchaseRequest(data)

    return { data: { data, page, limit, total, dataExtend } }
  }

  async getMany(
    query: PurchaseRequestGetManyQuery
  ): Promise<ResponseBuilderType> {
    const { limit, filter } = query

    const data = await this.purchaseRequestRepository.findMany({
      condition: {
        code: filter.searchText ? { LIKE: filter.searchText } : undefined,
        // code: filter.code,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      limit,
    })
    return { data }
  }

  async getOne(
    id: string,
    query?: PurchaseRequestGetOneByIdQuery
  ): Promise<ResponseBuilderType> {
    const data = await this.purchaseRequestRepository.findOne({
      relation: { purchaseRequestItems: true },
      condition: { id },
    })
    if (!data) throw new BusinessException('error.NOT_FOUND')

    const dataExtend =
      await this.informationService.getInformationFromPurchaseRequest([data])
    return { data: { data, dataExtend } }
  }

  async createDraft(
    body: PurchaseRequestCreateBody,
    userId: number
  ): Promise<ResponseBuilderType> {
    const { items, ...purchaseRequestBody } = body

    await Promise.all([
      this.validateService.validateCostCenter(body.costCenterId),
      this.validateService.validateVendor(body.vendorId),
      this.validateService.validateItem(body.items.map((i) => i.itemId)),
    ])

    const code = await this.purchaseRequestRepository.generateNextCode({})

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.insertOneFullField({
        ...purchaseRequestBody,
        code,
        status: PurchaseRequestStatus.DRAFT,
        userIdRequest: userId,
        createdByUserId: userId,
        updatedByUserId: userId,
      })

    const itemsDto: PurchaseRequestItemInsertType[] = items.map((item) => {
      const dto: PurchaseRequestItemInsertType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItems =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: null, after: purchaseRequest.status },
      content: 'Tạo mới thành công',
      time: new Date(),
    })

    return { data: purchaseRequest }
  }

  async createWaitConfirm(
    body: PurchaseRequestCreateBody,
    userId: number
  ): Promise<ResponseBuilderType> {
    const { items, ...purchaseRequestBody } = body

    await Promise.all([
      this.validateService.validateCostCenter(body.costCenterId),
      this.validateService.validateVendor(body.vendorId),
      this.validateService.validateItem(body.items.map((i) => i.itemId)),
    ])

    const code = await this.purchaseRequestRepository.generateNextCode({})

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.insertOneFullField({
        ...purchaseRequestBody,
        code,
        status: PurchaseRequestStatus.WAIT_CONFIRM,
        userIdRequest: userId,
        createdByUserId: userId,
        updatedByUserId: userId,
      })

    const itemsDto: PurchaseRequestItemInsertType[] = items.map((item) => {
      const dto: PurchaseRequestItemInsertType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItems =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: null, after: purchaseRequest.status },
      content: 'Tạo mới yêu cầu mua',
      time: new Date(),
    })

    return { data: purchaseRequest }
  }

  async updateOne(options: {
    id: string
    body: PurchaseRequestUpdateBody
    userId: number
  }): Promise<ResponseBuilderType> {
    const { id, body, userId } = options
    const { items, ...purchaseRequestBody } = body

    await Promise.all([
      this.validateService.validateCostCenter(body.costCenterId),
      this.validateService.validateVendor(body.vendorId),
      this.validateService.validateItem(body.items.map((i) => i.itemId)),
    ])

    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseRequestStatus.DRAFT,
        PurchaseRequestStatus.WAIT_CONFIRM,
        PurchaseRequestStatus.REJECT,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    let status: PurchaseRequestStatus
    if (rootData.status === PurchaseRequestStatus.DRAFT) {
      status = PurchaseRequestStatus.DRAFT
    } else if (rootData.status === PurchaseRequestStatus.WAIT_CONFIRM) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    } else if (rootData.status === PurchaseRequestStatus.REJECT) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    }

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          ...purchaseRequestBody,
          status,
          userIdRequest: userId,
          updatedByUserId: userId,
        }
      )
    await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: id,
    } as any)

    const itemsDto: PurchaseRequestItemInsertType[] = items.map((item) => {
      const dto: PurchaseRequestItemInsertType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItems =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Chỉnh sửa yêu cầu mua',
      time: new Date(),
    })

    return { data: purchaseRequest }
  }

  async waitConfirm(options: {
    id: string
    userId: number
  }): Promise<ResponseBuilderType> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.DRAFT].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    await Promise.all([
      this.validateService.validateCostCenter(rootData.costCenterId),
      this.validateService.validateVendor(rootData.vendorId),
      this.validateService.validateItem(
        rootData.purchaseRequestItems.map((i) => i.itemId)
      ),
      // TODO: validate đơn vị tính, thời hạn giao hàng có thay đổi không
    ])

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.WAIT_CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Đề nghị duyệt yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async confirm(options: {
    id: string
    userId: number
  }): Promise<ResponseBuilderType> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }
    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Xác nhận yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async reject(options: {
    id: string
    userId: number
  }): Promise<ResponseBuilderType> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.WAIT_CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }
    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.REJECT,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Từ chối yêu cầu mua',
      time: new Date(),
    })
    return { data: purchaseRequest }
  }

  async cancel(options: {
    id: string
    userId: number
  }): Promise<ResponseBuilderType> {
    const { id, userId } = options
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    // TODO
    // Check có PO đang ở trạng thái đã đặt hàng, đang giao hàng, hoàn thành không ?? => NẾu có thì lỗi

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.CANCEL,
          updatedByUserId: userId,
        }
      )
    return { data: purchaseRequest }
  }

  async success(id: string, userId: number): Promise<ResponseBuilderType> {
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (![PurchaseRequestStatus.CONFIRM].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    // TODO: Check logic hoàn thành

    const purchaseRequest: PurchaseRequestType =
      await this.purchaseRequestRepository.updateOne(
        { id },
        {
          status: PurchaseRequestStatus.CONFIRM,
          updatedByUserId: userId,
        }
      )

    // Lưu lịch sử
    await this.purchaseRequestHistoryRepository.insertOneFullField({
      _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
      userId,
      status: { before: rootData.status, after: purchaseRequest.status },
      content: 'Yêu cầu mua hoàn thành',
      time: new Date(),
    })
    return { data: id }
  }

  async deleteOne(id: string): Promise<ResponseBuilderType> {
    const rootData = await this.purchaseRequestRepository.findOneById(id)
    if (!rootData) {
      throw new BusinessException('error.NOT_FOUND')
    }
    if (
      ![
        PurchaseRequestStatus.DRAFT,
        PurchaseRequestStatus.WAIT_CONFIRM,
      ].includes(rootData.status)
    ) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    await this.purchaseRequestRepository.deleteOneBy({ id } as any)
    await this.purchaseRequestItemRepository.deleteManyBy({
      _purchase_request_id: id,
    } as any)
    return { data: id }
  }

  async history(id: string): Promise<ResponseBuilderType> {
    const data = await this.purchaseRequestHistoryRepository.findManyBy({
      _purchase_request_id: new Types.ObjectId(id),
    })

    // GET thêm dataUser

    return { data: data }
  }
}
