import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { SoapModule, SoapModuleOptions } from 'nestjs-soap'
import { SoapItemGroupConfig } from './soap-item-group.config'
import { SoapItemGroupService } from './soap-item-group.service'
import { SyncItemGroupService } from './sync-item-group.service'

@Module({
  imports: [
    SoapModule.forRootAsync({
      clientName: 'SOAP_ITEM_GROUP_SERVICE',
      imports: [ConfigModule.forFeature(SoapItemGroupConfig)],
      inject: [SoapItemGroupConfig.KEY],
      useFactory: async (
        soapItemGroupConfig: ConfigType<typeof SoapItemGroupConfig>
      ): Promise<SoapModuleOptions> => ({
        clientName: 'SOAP_ITEM_GROUP_SERVICE',
        uri: soapItemGroupConfig.syncItemGroupUri,
        auth: {
          type: 'basic',
          username: soapItemGroupConfig.username,
          password: soapItemGroupConfig.password,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [SoapItemGroupService, SyncItemGroupService],
  exports: [SyncItemGroupService],
})
export class SoapItemGroupModule {}
