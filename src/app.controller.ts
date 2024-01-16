import { Public } from '@core/decorator/set-public.decorator';
import { NatsClientService } from '@components/nats-transporter/nats-client.service';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseBuilder } from '@utils/response-builder';
import { AppService } from './app.service';
import { NatsService } from '@config/nats.config';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly natsClientService: NatsClientService,
  ) {}

  @Get('/ping')
  @MessagePattern('ping')
  async ping(): Promise<any> {
    return await this.appService.ping();
  }

  @Public()
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Put('update-permission')
  updatePermission(): Promise<void> {
    return this.appService.updatePermissions();
  }

  @MessagePattern(`${NatsService.SALE_ORDER_INSTRUCTION_SERVICE}.ping`)
  pingServer(@Body() body: any) {
    return new ResponseBuilder()
      .withData({
        msg: `${NatsService.SALE_ORDER_INSTRUCTION_SERVICE}: pong`,
        data: body,
      })
      .build();
  }
}
