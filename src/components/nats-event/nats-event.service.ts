import { Injectable } from '@nestjs/common'

@Injectable()
export class NatsEventService {
  constructor() {}

  async pong(data: any) {
    return {
      meta: data,
      data: {
        message: 'report-service: pong',
        time: Date.now(),
      },
    }
  }
}
