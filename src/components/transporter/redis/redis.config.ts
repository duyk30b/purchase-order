import { registerAs } from '@nestjs/config'

export const RedisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || '0',
}))
