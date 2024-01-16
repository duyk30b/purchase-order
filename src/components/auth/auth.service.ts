import { Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { InjectService } from '@nestcloud/service';
import { NatsClientService } from '@components/nats-transporter/nats-client.service';
import { NatsService } from '@config/nats.config';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectService()
    private readonly service: any,

    private readonly natsClientService: NatsClientService,
  ) {}

  async generateUrlInternalService(
    serviceName: string,
    url: string,
  ): Promise<string> {
    const servers = this.service.getServiceServers(serviceName, {
      passing: true,
    });

    const server = servers[Math.floor(Math.random() * servers.length)];

    return `http://${server.address}:${server.port}${url}`;
  }

  async validateToken(token: string, permissionCode: string): Promise<any> {
    const response = await this.natsClientService.send(
      `${NatsService.AUTH}.validate_token`,
      {
        permissionCode,
        token,
      },
    );
    return response;
  }

  // async validateToken(token: string, permissionCode: string): Promise<any> {
  //   this.httpClientService.axiosRef.defaults.headers.common[
  //     'authorization'
  //   ] = `${token}`;
  //   const url = await this.generateUrlInternalService(
  //     this.httpConfig.serviceName,
  //     `${this.endpoint}/token/validate`,
  //   );
  //
  //   return await firstValueFrom(
  //     this.httpClientService
  //       .get(url, {
  //         params: {
  //           permissionCode: permissionCode,
  //         },
  //       })
  //       .pipe(
  //         map((response) => response.data),
  //         retry(
  //           genericRetryStrategy({
  //             scalingDuration: 1000,
  //             excludedStatusCodes: [409],
  //           }),
  //         ),
  //         catchError((error) => of(error)),
  //       ),
  //   );
  // }
}
