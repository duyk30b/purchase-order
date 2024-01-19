import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './core/decorator/set-public.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Public()
  @Get('health')
  getHealth(): string {
    return this.appService.getHello()
  }
}
