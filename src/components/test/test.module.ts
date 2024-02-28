import { Module } from '@nestjs/common'
import { SoapPurchaseRequestModule } from '../sync-data/soap-purchase-request/soap-purchase-request.module'
import { TestController } from './test.controller'

@Module({
  imports: [SoapPurchaseRequestModule],
  controllers: [TestController],
  providers: [],
})
export class TestModule {}
