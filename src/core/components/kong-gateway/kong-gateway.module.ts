import { KongGatewayService } from './kong-gateway.service';
import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [],
})
export class KongGatewayModule {
  static forRootAsync(): DynamicModule {
    return {
      module: KongGatewayModule,
      providers: [KongGatewayService],
    };
  }
}
