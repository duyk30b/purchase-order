import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { AxiosError } from 'axios'
import { catchError, lastValueFrom } from 'rxjs'

@Injectable()
export class OdataPurchaseOrderService {
  private readonly logger = new Logger(OdataPurchaseOrderService.name)

  constructor(private readonly httpService: HttpService) {}

  @Interval(10000)
  async start() {
    this.logger.debug('===========')
    this.testConnect()
  }

  async testConnect() {
    const url =
      'https://my350617.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZ135F05FDAFE0A9957E72B8QueryResults?$inlinecount=allpages&$select=CTA_DATE,CRC_NPRC_AMT_CUR,TRC_NPRC_AMT_CUR,CRC_NET_AMT_CUR,TRC_NET_AMT_CUR,CLOG_CONF_TYPE,TLOG_CONF_TYPE,CINV_UNIT,TINV_UNIT,FCZ0COUNT,FCINV_QUAN_NORM,UCINV_QUAN_NORM,CLOG_AREA_UUID,TLOG_AREA_UUID,CMOVE_DIRECTION,TMOVE_DIRECTION,RCRC_NET_PRC_AMT,FCRC_NET_PRC_AMT,RCRC_NET_AMT,FCRC_NET_AMT,CREF_MST_ID,CREF_MST_IT_ID,CMATERIAL_UUID,TMATERIAL_UUID,CPURCHASING_UNIT,TPURCHASING_UNIT,CINV_TYPE,TINV_TYPE,CPRODUCT_CAT_INT_ID_STRG,CLOCATION_UUID,TLOCATION_UUID,CSELLER,TSELLER,CSCRAP_UNIT,TSCRAP_UNIT,KCZ0COUNT,KCINV_QUAN_NORM,KCRC_NET_PRC_AMT,KCRC_NET_AMT&$top=50&$skip=0&$format=json'
    const url2 =
      'https://my350617.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZ40EA983FB0B46D87610CAEQueryResults?$inlinecount=allpages&$select=FCHEIGHT,CYDPMY2K7Y_4F3BFDC317,FCFIXED_LOT_SIZE_QUANTITY_CONT,TLENGTH_UNIT_CODE,FCLENGTH,CMATERIAL_CREATION_DT,CNET_WEIGHT_UNIT_CODE,CY02DJU6PY_BD7FC12D82,FCNET_WEIGHT,CPLANNED_DELIVERY_DURATION_DESC,CPROD_CAT_INT_ID,CMATR_INT_ID,TMATR_INT_ID,CYDPMY2K7Y_4296C04A63,FCSAFETY_STOCK_QUANTITY_CONT,CCORRESPOND_QUANTITY_UNIT_CODE,FCCORRESPOND_QUANTITY_CONTENT,CMATERIAL_LAST_CHANGE_DT,TSTATUS_LIFE_CYCLE_STATUS_CODE,CPRODUCT_CAT_INT_ID_STRG,FCWIDTH,CBASE_MSR_UNIT&$top=50&$skip=50&$format=json'
    const start = this.httpService
      .get(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            'AE-0000002:Snp12345678'
          ).toString('base64')}`,
        },
      })
      .pipe(
        catchError((error: AxiosError) => {
          console.log(
            '🚀 ~ file: odata-client.service.ts:25 ~ OdataClientService ~ catchError ~ error:',
            error
          )
          throw error
        })
      )

    const response = await lastValueFrom(start)
    console.log(
      '🚀 ~ file: odata-client.service.ts:44 ~ OdataClientService ~ testConnect ~ response:',
      response.data
    )
    return response.data

    // const data1 = await o('https://my350617.sapbydesign.com', {
    //   batch: {
    //     headers: new Headers({
    //       Authorization: `Basic ${Buffer.from('AE-0000003:Smc@1234').toString(
    //         'base64',
    //       )}`,
    //     }),
    //   },
    // } as any)
    //   .get(
    //     'sap/byd/odata/ana_businessanalytics_analytics.svc/RPZB51B94DE698C4FC50742E5QueryResults',
    //   )
    //   .query({
    //     $select: 'CPROD_CATG_UUID,TPROD_CATG_UUID',
    //     $format: 'json',
    //   });
    // console.log(
    //   '🚀 ~ file: odata-client.service.ts:10 ~ OdataClientService ~ testConnect ~ data1:',
    //   data1,
    // );
    // return { data1 };
  }
}
