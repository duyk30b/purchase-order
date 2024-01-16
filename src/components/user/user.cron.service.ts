import { NatsClientService } from '@components/nats-transporter/nats-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCronService {
  constructor(private readonly natsClientService: NatsClientService) {}

  async insertPermission(permissions): Promise<any> {
    return await this.natsClientService.send('insert_permission', permissions);
  }

  async deletePermissionNotActive(): Promise<any> {
    return await this.natsClientService.send(
      'delete_permission_not_active',
      {},
    );
  }
}
