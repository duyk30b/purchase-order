import { Injectable } from '@nestjs/common'
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose'
import 'dotenv/config'
import * as mongoose from 'mongoose'

const MongoDbConfig = {
  type: 'mongodb',
  host: process.env.DATABASE_MONGO_HOST,
  port: parseInt(process.env.DATABASE_MONGO_PORT),
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  username: process.env.DATABASE_MONGO_USERNAME,
  password: process.env.DATABASE_MONGO_PASSWORD,
  database: process.env.DATABASE_NAME,
  authSource: process.env.DATABASE_AUTH_SOURCE || 'admin',
  logging: process.env.NODE_ENV === 'local',
}

const { username, password, host, port, database, authSource, logging } = MongoDbConfig

export const mongoDbUri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`

@Injectable()
export default class MongodbConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    mongoose.set('debug', logging)
    mongoose.set('toObject', { virtuals: true })
    mongoose.set('toJSON', { virtuals: true })
    return { uri: mongoDbUri }
  }
}
