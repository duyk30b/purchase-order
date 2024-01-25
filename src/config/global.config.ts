import { registerAs } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'

export const GlobalConfig = registerAs('global', () => ({
  NODE_ENV: process.env.NODE_ENV || 'local',
  APP_HOST: process.env.APP_HOST || 'localhost',
  APP_CONTAINER_PORT: Number(process.env.APP_CONTAINER_PORT),
  SERVER_HTTP_PORT: parseInt(process.env.SERVER_HTTP_PORT) || 3001,
  API_PATH: process.env.API_PATH,
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : '*',
  INTERNAL_TOKEN:
    process.env.INTERNAL_TOKEN ||
    't5AQ1il1FtOk6Pp9FEW0VbwYETYqqseisgvo0ZCchayvvsQYFSkNzP7bNZ7vEFr0B1Hd4Ft3KGls1q2Irc20Yv1juslgTgtP4lavfeFiw7qBDDzw5D5Y7vMxoIfkpEqcViZqcPy3K2TCOqzCVGAQjJ4bvmX01xeCqILT5ewBd7fL3hZ4jBlSYmbiIefVIiRzeFhWCYOuVpS4Ng4lPcEBvUorm5zlLAci65UKdKtoXbPtWp2A1jrE5D',
  FILE_SERVICE: {
    options: {
      port: process.env.FILE_SERVICE_PORT || 3001,
      host: process.env.FILE_SERVICE_HOST || 'file-service',
    },
    transport: Transport.TCP,
  },
}))
