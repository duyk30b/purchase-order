import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { OdataPurchaseOrderService } from './odata-purchase-order.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [OdataPurchaseOrderService],
  exports: [OdataPurchaseOrderService],
})
export class OdataPurchaseOrderModule {}
