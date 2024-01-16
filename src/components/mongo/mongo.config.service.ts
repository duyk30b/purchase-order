import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { isDevMode } from '@utils/helper';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoDbConfig = {
  type: 'mongodb',
  host: process.env.DATABASE_MONGO_HOST,
  port: parseInt(process.env.DATABASE_MONGO_PORT),
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  username: process.env.DATABASE_MONGO_USERNAME,
  password: process.env.DATABASE_MONGO_PASSWORD,
  database: process.env.DATABASE_NAME,
  authSource: process.env.DATABASE_AUTH_SOURCE || 'admin',
  logging: isDevMode(),
  enableUtf8Validation: false,
};

@Injectable()
export default class MongoConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { username, password, host, port, database, authSource, logging } =
      mongoDbConfig;
    mongoose.set('debug', logging);
    return {
      uri: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`,
    };
  }
}
