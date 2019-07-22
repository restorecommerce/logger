import { createLogger, LoggerOptions, Logger } from 'winston';
export {
  LoggerOptions as WinstonLoggerOptions,
  transports as Transports,
  format, log,
} from 'winston';

export type TransportStreamArray = Logger['transports'];

class WinstonLoggerClass {
  constructor(opts?: LoggerOptions) {
    const logger = createLogger(opts);
    Object.setPrototypeOf(this, logger);
  }
}

export const WinstonLogger = WinstonLoggerClass as { new(opts?: LoggerOptions): Logger; };