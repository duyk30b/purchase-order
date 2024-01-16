import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NatsClientService {
  constructor(
    @Inject('NATS_CLIENT_SERVICE') private readonly natsClient: ClientNats,
  ) {}

  async send(pattern: string, data: any): Promise<any> {
    const request = this.natsClient.send(pattern, data);
    return await firstValueFrom(request);
  }
}
