import { Injectable, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
import { BusinessException } from '../../../core/exception-filter/exception-filter'
import { PurchaseRequestItemRepository } from '../../../mongo/purchase-request-item/purchase-request-item.repository'
import { PurchaseRequestItemType } from '../../../mongo/purchase-request-item/purchase-request-item.schema'
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
  PurchaseRequestGetOneQuery,
  PurchaseRequestPaginationQuery,
  PurchaseRequestUpdateBody,
} from './request'

@Injectable()
export class ApiPurchaseRequestService {
  private logger = new Logger(ApiPurchaseRequestService.name)

  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly purchaseRequestItemRepository: PurchaseRequestItemRepository,
    private readonly informationService: InformationService,
    private readonly validateService: ValidateService
  ) {}

  async pagination(query: PurchaseRequestPaginationQuery) {
    const { page, limit, filter, sort, relation } = query

    const { total, data } = await this.purchaseRequestRepository.pagination({
      page,
      limit,
      relation,
      condition: {
        code: filter.searchText,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      sort: sort || { _id: 'DESC' },
    })

    const dataExtend = await this.informationService.getInformationFromPurchaseRequest(data)

    return { page, limit, total, data, dataExtend }
  }

  async getMany(query: PurchaseRequestGetManyQuery) {
    const { limit, filter } = query

    return await this.purchaseRequestRepository.findMany({
      condition: {
        code: filter.searchText,
        requestDate: filter.requestDate,
        receiveDate: filter.receiveDate,
        costCenterId: filter.costCenterId,
        sourceAddress: filter.sourceAddress,
        vendorId: filter.vendorId,
        status: filter.status,
      },
      limit,
    })
  }

  async getOne(id: string, query?: PurchaseRequestGetOneQuery) {
    const data = await this.purchaseRequestRepository.findOneBy({ id })
    if (!data) throw new BusinessException('error.NOT_FOUND')
    return data
  }

  async createOne(body: PurchaseRequestCreateBody, userId: number) {
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

    const itemsDto: PurchaseRequestItemType[] = items.map((item) => {
      const dto: PurchaseRequestItemType = {
        ...item,
        _purchase_request_id: new Types.ObjectId(purchaseRequest.id),
        _price: new Types.Decimal128(item.price),
        createdByUserId: userId,
        updatedByUserId: userId,
      }
      return dto
    })

    purchaseRequest.purchaseRequestItemList =
      await this.purchaseRequestItemRepository.insertManyFullField(itemsDto)

    return purchaseRequest
  }

  async updateOne(id: string, body: PurchaseRequestUpdateBody) {
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
    if (![PurchaseRequestStatus.DRAFT, PurchaseRequestStatus.REJECT].includes(rootData.status)) {
      throw new BusinessException('error.PURCHASE_REQUEST.STATUS_INVALID')
    }

    let status: PurchaseRequestStatus
    if (rootData.status === PurchaseRequestStatus.DRAFT) {
      status = PurchaseRequestStatus.DRAFT
    } else if (rootData.status === PurchaseRequestStatus.REJECT) {
      status = PurchaseRequestStatus.WAIT_CONFIRM
    }
  }

  async deleteOne(id: string) {
    const data = await this.purchaseRequestRepository.updateOne({ id }, { deletedAt: new Date() })
    return data
  }
}
