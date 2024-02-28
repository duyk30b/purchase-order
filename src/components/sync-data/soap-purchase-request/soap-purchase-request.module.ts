import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { SoapModule, SoapModuleOptions } from 'nestjs-soap'
import { SoapPurchaseRequestConfig } from './soap-purchase-request.config'
import { SoapPurchaseRequestService } from './soap-purchase-request.service'

@Module({
  imports: [
    SoapModule.forRootAsync({
      clientName: 'SOAP_PURCHASE_REQUEST_SERVICE',
      imports: [ConfigModule.forFeature(SoapPurchaseRequestConfig)],
      inject: [SoapPurchaseRequestConfig.KEY],
      useFactory: async (
        soapPurchaseRequestConfig: ConfigType<typeof SoapPurchaseRequestConfig>
      ): Promise<SoapModuleOptions> => ({
        clientName: 'SOAP_PURCHASE_REQUEST_SERVICE',
        uri: soapPurchaseRequestConfig.syncPurchaseRequestUri,
        auth: {
          type: 'basic',
          username: soapPurchaseRequestConfig.username,
          password: soapPurchaseRequestConfig.password,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [SoapPurchaseRequestService],
  exports: [SoapPurchaseRequestService],
})
export class SoapPurchaseRequestModule {}
