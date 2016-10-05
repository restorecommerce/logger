'use strict';

const util = require('util');
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const elasticsearchTransport = require('restore-winston-elasticsearch-transformer');

const mappingTemplate = elasticsearchTransport.mappingTemplate;
const transformer = elasticsearchTransport.transformer;

const levels = [
  'silly',
  'verbose',
  'debug',
  'info',
  'warn',
  'error'
];

/**
 * Restore logger
 * @class
 * @classdesc Logger wraps the winston logger with Restore specifics
 * @param {Object} [conf] - configuration
 */
function Logger(conf) {
  let loggerCfg;
  if (conf) {
    loggerCfg = conf.get('logger');
  }

  // Set up logging
  winston.log.namespaces = true;
  if (loggerCfg) {
    const transports = [];
    Object.keys(loggerCfg).forEach((transport) => {
      switch (transport) {
        case 'console': {
          transports.push(new (winston.transports.Console)(loggerCfg.console));
          break;
        }
        case 'file': {
          transports.push(new (winston.transports.File)(loggerCfg.file));
          break;
        }
        case 'elasticsearch': {
          const esTransportOpts = loggerCfg.elasticsearch;
          esTransportOpts.mappingTemplate = mappingTemplate;
          transformer.source = loggerCfg.elasticsearch.source;
          esTransportOpts.transformer = transformer;
          transports.push(new Elasticsearch(esTransportOpts));
          break;
        }
        default:
          throw new Error('Provide at least one supported transport');
      }
    });
    winston.loggers.add('restore', {
      transports
    });
  }

  const rslogger = winston.loggers.get('restore');

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
        generateMetaObj(args)
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
      generateMetaObj(callargs)
    ]);
  };
  return wrapper;
}

module.exports = Logger;

function generateMessage(args) {
  const message = args[0];
  if (util.isString(message)) {
    Array.prototype.shift.apply(args);
  }
  return message;
}

/**
 * Convert arguments array to an object
 * @param {Array} args
 * @returns {Object} formatted log object
 */
function generateMetaObj(args) {
  const logObj = {};
  Object.keys(args).forEach((k) => {
    let v = args[k];
    // Winston only inspects metadata in the log function;
    // array of string messages in the second argument of the log function
    // won't be inspected automatically. Inspect error objects here manually.
    if (v instanceof Error) {
      v = util.inspect(v);
    }
    logObj[k] = v;
  });
  return logObj;
}
