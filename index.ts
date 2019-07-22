import Elasticsearch, { ElasticsearchTransportOptions } from 'winston-elasticsearch';
import * as winstonESTransformer from '@restorecommerce/winston-elasticsearch-transformer';
import * as rTracer from 'cls-rtracer';
import { WinstonLoggerOptions, Transports, format, WinstonLogger, TransportStreamArray, log } from './winston';

const mappingTemplate = winstonESTransformer.mappingTemplate;
const transformer = winstonESTransformer.transformer;
const { timestamp, printf } = format;

// a custom format that outputs request id
const rTracerFormat = printf((info) => {
  const rid = rTracer.id();
  const time = info.timestamp;
  const level = info.level;
  const message = info.message;
  delete info.timestamp;
  delete info.level;
  delete info.message;
  let object = '';
  if (Object.entries(info).length !== 0 && info.constructor === Object) {
    object = JSON.stringify(info);
  }
  return rid
    ? `${level} : ${time} [rid:${rid}] : ${message} ${((object))}`
    : `${level} : ${time} : ${message} ${(object)}`;
});

export interface RestoreLoggerOptions extends WinstonLoggerOptions {
  console?: Transports.ConsoleTransportInstance & {
    // Custom console opts here
  };
  file?: Transports.FileTransportOptions & {
    // Custom file opts here
  };
  elasticsearch?: ElasticsearchTransportOptions & {
    source?: any;
  };
}

export class Logger extends WinstonLogger {
  constructor(opts: RestoreLoggerOptions) {
    // Set up logging
    (log as any).namespaces = true;
    if (!opts) throw new Error('Options are missing');

    // Provide TransportStream array and add opts.transports
    let transports: TransportStreamArray = [];
    if (opts.transports && !Array.isArray(transports)) {
      transports = [transports];
    } else if (Array.isArray(opts.transports)) {
      transports = opts.transports;
    }

    let transportsCount = 0;
    Object.keys(opts).forEach((transport) => {
      switch (transport) {
        case 'console': {
          const consoleOpts = {
            ...opts[transport],
            format: format.combine(
              format.colorize(),
              format.simple(),
              timestamp(),
              rTracerFormat
            )
          };

          transportsCount ++;
          transports.push(new Transports.Console(consoleOpts));
          break;
        }
        case 'file': {
          transportsCount ++;
          transports.push(new Transports.File(opts[transport]));
          break;
        }
        case 'elasticsearch': {
          transportsCount ++;
          const elasticsearchOpts = {
            mappingTemplate,
            ...opts[transport],
          };

          transformer.source = opts.elasticsearch.source;
          elasticsearchOpts.transformer = transformer;
          transports.push(new Elasticsearch(elasticsearchOpts));
          break;
        }
        default:
        // ignore
      }
    });

    if (transportsCount <= 0) {
      throw new Error('Provide at least one supported transport');
    }

    super({
      ...opts,
      transports
    });
  }
}