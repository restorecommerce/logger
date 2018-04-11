'use strict';

const util = require('util');
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const elasticsearchTransport = require('@restorecommerce/winston-elasticsearch-transformer');

const mappingTemplate = elasticsearchTransport.mappingTemplate;
const transformer = elasticsearchTransport.transformer;

const levels = [
  'silly',
  'debug',
  'verbose',
  'info',
  'warn',
  'error'
];

let loggerName;

/**
 Restore logger
 @class
 @classdesc Logger wraps the winston logger with Restore specifics
 @param {Object} [opts] - configuration object with transport specific options
 */
function Logger(opts) {
  if (!opts) throw new Error('Options are missing');

  loggerName = opts.loggerName || 'restore';

  // Set up logging
  winston.log.namespaces = true;
  let transportsCount = 0;
  const transports = [];
  Object.keys(opts).forEach((transport) => {
    switch (transport) {
      case 'console': {
        transportsCount += 1;
        transports.push(new (winston.transports.Console)(opts[transport]));
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

  winston.loggers.add(loggerName, {
    transports
  });

  const rslogger = winston.loggers.get(loggerName);

  /*
  Wrapping the winston logger with Restore specifics

  Winston's signature is:

  ### function log (level, msg, [meta], callback)
  #### @level {string} Level at which to log the message.
  #### @msg {string} Message to log
  #### @meta {Object} **Optional** Additional metadata to attach
  #### @callback {function} Continuation to respond to when compconste.
  Core logging method exposed to Winston. Metadata is optional.

  The signature of this logger is:

  @level
  @msg
  @meta
  */

  const wrapper = {};

  levels.forEach((level) => {
    wrapper[level] = function log(...args) {
      rslogger.log.apply(rslogger, [
        level,
        generateMessage(args),
        args
      ]);
    };
  });

  // Compatibility for using this logger with modules which expect
  // a `log()` function.
  wrapper.log = function log(...args) {
    const level = args[0].toLowerCase();
    const callargs = Array.prototype.splice.apply(args, [1]);
    rslogger.log.apply(rslogger, [
      level,
      generateMessage(callargs),
      callargs
    ]);
  };
  return wrapper;
}

module.exports = Logger;

function generateMessage(args) {
  let message;
  if (util.isString(args[0])) {
    message = args[0];
    Array.prototype.shift.apply(args);
  }
  return message;
}
