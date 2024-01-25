import { HttpStatus, Injectable } from '@nestjs/common'
import { BusinessException } from '../../../../core/exception-filter/exception-filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

@Injectable()
export class NatsClientAuthService {
  constructor(private readonly natsClient: NatsClientService) {}

  async validateToken(token: string, permissionCode: string): Promise<any> {
    const response: NatsResponseInterface = await this.natsClient.send(
      NatsSubject.AUTH.VALIDATE_TOKEN,
      { permissionCode, token }
    )
    if (response.statusCode !== 200) {
      throw new BusinessException(
        response.message as any,
        HttpStatus.UNAUTHORIZED
      )
    }
    return response.data
  }
}
