import { Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

@Injectable()
export class NatsClientAttributeService {
  constructor(private readonly natsClient: NatsClientService) {}

  async getTemplatesByIds(data: { ids: string[] }): Promise<any[]> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.ATTRIBUTE.GET_TEMPLATES_BY_IDS,
      data
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(response.message as any)
    }
    return response.data
  }
}
