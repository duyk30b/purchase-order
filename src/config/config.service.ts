import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const GlobalConfig = registerAs('global', () => ({
  tcpServers: {
    userService: {
      port: Number(process.env.USER_SERVICE_PORT) || 3000,
      host: process.env.USER_SERVICE_HOST || 'user-service',
    },
  },
}));

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    this.envConfig = {
      port: process.env.SERVER_PORT,
      httpPort: process.env.SERVER_HTTP_PORT || 3001,
      natServers: process.env.NAT_SERVERS?.split(',') || ['nats://nats:4222'],
    };

    this.envConfig.internalToken =
      process.env.INTERNAL_TOKEN ||
      't5AQ1il1FtOk6Pp9FEW0VbwYETYqqseisgvo0ZCchayvvsQYFSkNzP7bNZ7vEFr0B1Hd4Ft3KGls1q2Irc20Yv1juslgTgtP4lavfeFiw7qBDDzw5D5Y7vMxoIfkpEqcViZqcPy3K2TCOqzCVGAQjJ4bvmX01xeCqILT5ewBd7fL3hZ4jBlSYmbiIefVIiRzeFhWCYOuVpS4Ng4lPcEBvUorm5zlLAci65UKdKtoXbPtWp2A1jrE5D';
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.fileUri = process.env.FILE_SEVICE_URL;
    this.envConfig.corsOrigin = '*';
    this.envConfig.userService = {
      options: {
        port: process.env.USER_SERVICE_PORT || 3000,
        host: process.env.USER_SERVICE_HOST || 'user-service',
      },
      transport: Transport.TCP,
    };
    this.envConfig.notificationService = {
      options: {
        port: process.env.NOTIFICATION_SERVICE_PORT || 3001,
        host: process.env.NOTIFICATION_SERVICE_HOST || 'notification-service',
      },
    };
    this.envConfig.fileService = {
      options: {
        port: process.env.FILE_SERVICE_PORT || 3001,
        host: process.env.FILE_SERVICE_HOST || 'file-service',
      },
      transport: Transport.TCP,
    };
    this.envConfig.itemService = {
      options: {
        port: process.env.ITEM_SERVICE_PORT || 3000,
        host: process.env.ITEM_SERVICE_HOST || 'item-service',
      },
      transport: Transport.TCP,
    };
    this.envConfig.warehouseService = {
      options: {
        port: process.env.WAREHOUSE_SERVICE_PORT || 3000,
        host: process.env.WAREHOUSE_SERVICE_HOST || 'warehouse-service',
      },
      transport: Transport.TCP,
    };
    if (
      process.env.CORS_ORIGINS &&
      process.env.CORS_ORIGINS.split(',').length > 1
    ) {
      this.envConfig.corsOrigin = process.env.CORS_ORIGINS.split(',');
    }

    this.envConfig.saleService = {
      options: {
        port: process.env.SALE_SERVICE_PORT || 3000,
        host: process.env.SALE_SERVICE_HOST || 'sale-service',
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
