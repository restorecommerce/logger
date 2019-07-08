'use strict';

const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const elasticsearchTransport =
  require('@restorecommerce/winston-elasticsearch-transformer');
const { format } = require('winston');
const rTracer = require('cls-rtracer');

const mappingTemplate = elasticsearchTransport.mappingTemplate;
const transformer = elasticsearchTransport.transformer;
const { timestamp, printf } = format;

// a custom format that outputs request id
/* eslint-disable no-param-reassign */
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
    ? `${level} : ${time} [request-id:${rid}] : ${message} ${((object))}`
    : `${level} : ${time} : ${message} ${(object)}`;
});

/**
 Logger
 @class
 @classdesc Logger wraps the winston logger with Restore specifics
 @param {Object} [opts] - configuration object with transport specific
options
 */
class Logger {
  constructor(opts) {
    if (!opts) throw new Error('Options are missing');

    // Set up logging
    winston.log.namespaces = true;
    let transportsCount = 0;
    const transports = [];
    Object.keys(opts).forEach((transport) => {
      switch (transport) {
        case 'console': {
          transportsCount += 1;
          const consoleOpts = Object.assign({}, opts[transport], {
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              timestamp(),
              rTracerFormat
            )
          });
          transports.push(new (winston.transports.Console)(consoleOpts));
          break;
        }
        case 'file': {
          transportsCount += 1;
          transports.push(new (winston.transports.File)(opts[transport]));
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

    return winston.createLogger({ transports });
  }
}

module.exports = Logger;
