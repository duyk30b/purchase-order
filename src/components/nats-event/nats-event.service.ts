import { Injectable } from '@nestjs/common'

@Injectable()
export class NatsEventService {
  constructor() {}

  async pong(data: any) {
    return {
      meta: data,
      data: {
        message: 'purchase-order-service: pong',
        time: Date.now(),
      },
    }
  }
}
