import { ElasticsearchTransportOptions } from 'winston-elasticsearch';
import { WinstonLoggerOptions, Transports, WinstonLogger } from './winston';
export interface RestoreLoggerOptions extends WinstonLoggerOptions {
    console?: Transports.ConsoleTransportInstance & {};
    file?: Transports.FileTransportOptions & {};
    elasticsearch?: ElasticsearchTransportOptions & {
        source?: any;
    };
}
export declare class Logger extends WinstonLogger {
    constructor(opts: RestoreLoggerOptions);
}
