import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { isDevMode } from '@utils/helper';
const format = winston.format;
const transports = winston.transports;

const transportArr: any = [
  new transports.DailyRotateFile({
    filename: `logs/${process.env.SERVER_NAME}/%DATE%-error.log`,
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxFiles: `${process.env.MAX_LOG_DAYS || '30d'}`, // will keep log until they are older than 30 days
  }),
  new transports.DailyRotateFile({
    filename: `logs/${process.env.SERVER_NAME}/%DATE%-combined.log`,
    level: 'debug',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxFiles: `${process.env.MAX_LOG_DAYS || '30d'}`,
  }),
];

if (isDevMode()) {
  transportArr.push(
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}+`;
        }),
      ),
    }),
  );
}

export const LoggerConfig = WinstonModule.createLogger({
  transports: transportArr,
});
