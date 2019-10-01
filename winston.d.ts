import { LoggerOptions, Logger } from 'winston';
export { LoggerOptions as WinstonLoggerOptions, transports as Transports, format, log, } from 'winston';
export declare type TransportStreamArray = Logger['transports'];
export declare const WinstonLogger: new (opts?: LoggerOptions) => Logger;
