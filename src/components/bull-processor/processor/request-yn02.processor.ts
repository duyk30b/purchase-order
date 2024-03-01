import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { NatsRequestService } from '../../transporter/nats/nats-request/nats-request.service'
import { IncotermType } from '../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.response'
import { NatsClientIncotermService } from '../../transporter/nats/nats-sale/nats-client-incoterm/nats-client-incoterm.service'
import { SupplierType } from '../../transporter/nats/nats-vendor/nats-client-vendor.response'
import { NatsClientVendorService } from '../../transporter/nats/nats-vendor/nats-client-vendor.service'
import {
  CostCenterType,
  NatsClientCostCenterService,
} from '../../transporter/nats/service/nats-client-cost-center.service'
import {
  CurrencyType,
  ItemType,
  ItemTypeType,
  NatsClientItemService,
} from '../../transporter/nats/service/nats-client-item.service'
import { IRequestYn02Message } from '../../transporter/redis/bull-queue/bull-queue.interface'
import { QUEUE_EVENT } from '../../transporter/redis/bull-queue/bull-queue.variable'

@Processor(QUEUE_EVENT.REQUEST_YN02)
export class RequestYn02Processor {
  private readonly logger = new Logger(RequestYn02Processor.name)

  constructor(
    private readonly natsRequestService: NatsRequestService,
    private readonly natsClientCostCenterService: NatsClientCostCenterService,
    private readonly natsClientVendorService: NatsClientVendorService,
    private readonly natsClientIncotermService: NatsClientIncotermService,
    private readonly natsClientItemService: NatsClientItemService
  ) {}

  @Process('CREATE')
  async handleProcess({ data }: Job<IRequestYn02Message>) {
    this.logger.log('START JOB CREATE YNO2')
    this.logger.log(JSON.stringify(data))
    const { costCenter, supplier, incoterm, item, itemType, currency } =
      await this.getInformation({
        costCenterCode: data.CPURCHASING_UNIT,
        supplierCode: data.CSELLER,
        incotermCode: data.CINC_CLASS_CD,
        itemCode: data.CMATERIAL_UUID,
        itemTypeId: Number(data.CPRODUCT_CAT_INT_ID_STRG), // chưa rõ dùng itemTypeId hay itemTypeCode
        currencyCode: data['CPUR_ORDER_CRNCY'], // chưa thấy field này
      })

    await this.natsRequestService.createYn02({
      code: data.CCONF_ID,
      costCenterId: costCenter?.id || '',
      purchaseOrderId: '65a177182b9010e15a9f2d7c', // fake tạm
      vendorId: supplier?.id || '',
      isApplyFee: !!incoterm?.isApplySurchargeRate,
      description: data.CREF_ID,
      details: [
        {
          warehouseId: 0,
          itemId: item?.id,
          itemTypeSettingId: itemType?.id,
          requestMainQuantity: Number(
            data.FCINV_QUAN_NORM.split(' ')[0]
              .replaceAll('.', '')
              .replaceAll(',', '.')
          ),
          requestSubQuantity: Number(
            data.FCCONF_QUAN.split(' ')[0]
              .replaceAll('.', '')
              .replaceAll(',', '.')
          ),
          price: Number(data.KCNET_PRC_AMT),
          currencyId: currency?.id || 0,
          amount: Number(data.KCZ7B2C3FDBA947C92EC4F382),
          locatorId: '65a177182b9010e15a9f2d7c', // fake tạm
        },
      ],
    })
  }

  async getInformation(options: {
    costCenterCode: string
    supplierCode: string
    incotermCode: string
    itemCode: string
    itemTypeId: number
    currencyCode: string
  }) {
    const {
      costCenterCode,
      supplierCode,
      incotermCode,
      itemCode,
      itemTypeId,
      currencyCode,
    } = options

    const dataExtendsPromise = await Promise.allSettled([
      costCenterCode
        ? this.natsClientCostCenterService.getCostCenterList({
            codes: [costCenterCode],
          })
        : [],
      supplierCode
        ? this.natsClientVendorService.getOneSupplier({
            filter: { code: supplierCode },
          })
        : {},
      incotermCode
        ? this.natsClientIncotermService.incotermGetOne({
            filter: { code: incotermCode },
          })
        : {},
      itemCode
        ? this.natsClientItemService.getItemsByCodes({ codes: [itemCode] })
        : [],
      itemTypeId
        ? this.natsClientItemService.getItemTypesByIds({ ids: [itemTypeId] })
        : [],
      currencyCode
        ? this.natsClientItemService.getCurrencyListByCodes({
            codes: [currencyCode],
          })
        : [],
    ])
    const dataExtendsResult = dataExtendsPromise.map((i, index) => {
      if (i.status === 'fulfilled') {
        return i.value
      } else {
        this.logger.error('Get info from Nats failed: ' + index)
        this.logger.error(i)
        return {}
      }
    }) as [
      CostCenterType[],
      SupplierType,
      IncotermType,
      ItemType[],
      ItemTypeType[],
      CurrencyType[],
    ]
    const [
      costCenterList,
      supplier,
      incoterm,
      itemList,
      itemTypeList,
      currencyList,
    ] = dataExtendsResult

    return {
      costCenter: costCenterList[0],
      supplier,
      incoterm,
      item: itemList[0],
      itemType: itemTypeList[0],
      currency: currencyList[0],
    }
  }

  @OnQueueFailed()
  async handleFailed(job: Job<any>, err: Error) {
    const { messageId, data, createTime } = job.data
    this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
  }
}
