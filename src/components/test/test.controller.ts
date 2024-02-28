import { Controller, Get } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SoapPurchaseRequestService } from '../sync-data/soap-purchase-request/soap-purchase-request.service'

@ApiTags('Test')
@ApiBearerAuth('access-token')
@Controller()
export class TestController {
  constructor(
    private readonly soapPurchaseRequestService: SoapPurchaseRequestService
  ) {}

  @Get('test-soap-pr')
  async testSoapPr() {
    return await this.soapPurchaseRequestService.test()
  }
}
