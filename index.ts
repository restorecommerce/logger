import {
  Logger as WinstonLogger, createLogger,
  format, log, transports as Transports
}
  from 'winston';
import Elasticsearch from 'winston-elasticsearch';
import * as winstonESTransformer from '@restorecommerce/winston-elasticsearch-transformer';
import * as rTracer from 'cls-rtracer';

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

export interface Logger extends WinstonLogger {
}

/**
 RestoreLogger
 @class
 @classdesc RestoreLogger wraps the winston logger with Restore specifics
 @param {Object} [opts] - configuration object with transport specific
options
 */
class RestoreLogger {
  constructor(opts: any) {
    if (!opts) throw new Error('Options are missing');

    // Set up logging
    (log as any).namespaces = true;
    let transportsCount = 0;
    const transports: any = [];
    Object.keys(opts).forEach((transport) => {
      switch (transport) {
        case 'console': {
          transportsCount += 1;
          const consoleOpts = Object.assign({}, opts[transport], {
            format: format.combine(
              format.colorize(),
              format.simple(),
              timestamp(),
              rTracerFormat
            )
          });
          transports.push(new (Transports.Console)(consoleOpts));
          break;
        }
        case 'file': {
          transportsCount += 1;
          transports.push(new (Transports.File)(opts[transport]));
          break;
        }
        case 'elasticsearch': {
          transportsCount += 1;
          const esTransportOpts = opts.elasticsearch;
          esTransportOpts.mappingTemplate = mappingTemplate;
          transformer.source = opts.elasticsearch.source;
          esTransportOpts.transformer = transformer;
          transports.push(new Elasticsearch(esTransportOpts));
          break;
        }
        default:
        // ignore
      }
    });

    if (transportsCount <= 0) {
      throw new Error('Provide at least one supported transport');
    }

    return createLogger({ transports });
  }
}

export const Logger = RestoreLogger as WinstonLogger;
