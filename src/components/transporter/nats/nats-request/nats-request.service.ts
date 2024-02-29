import { Injectable, Logger } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'
import { CreateYn02SapRequestDto } from './nats-request-create-yn02.dto'

@Injectable()
export class NatsRequestService {
  private readonly logger = new Logger(NatsRequestService.name)
  constructor(private readonly natsClient: NatsClientService) {}

  async createYn02(request: CreateYn02SapRequestDto) {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.REQUEST.CREATE_YN02_FROM_CAP,
      request
    )
    if (response.statusCode !== 200) {
      this.logger.error(JSON.stringify(response))
      throw new BusinessException(response.message as any)
    }
    return response.data
  }
}
