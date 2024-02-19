import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { SoapModule, SoapModuleOptions } from 'nestjs-soap'
import { SyncDataSapConfig } from '../sync-data-sap.config'
import { SoapItemGroupService } from './soap-item-group.service'
import { SyncItemGroupService } from './sync-item-group.service'

@Module({
  imports: [
    SoapModule.forRootAsync({
      clientName: 'SOAP_ITEM_GROUP_SERVICE',
      imports: [ConfigModule.forFeature(SyncDataSapConfig)],
      inject: [SyncDataSapConfig.KEY],
      useFactory: async (
        syncDataSapConfig: ConfigType<typeof SyncDataSapConfig>
      ): Promise<SoapModuleOptions> => ({
        clientName: 'SOAP_ITEM_GROUP_SERVICE',
        uri: syncDataSapConfig.syncItemGroupUri,
        auth: {
          type: 'basic',
          username: syncDataSapConfig.username,
          password: syncDataSapConfig.password,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [SoapItemGroupService, SyncItemGroupService],
  exports: [SyncItemGroupService],
})
export class SoapItemGroupModule {}
