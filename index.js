'use strict';

let util = require('util');
let winston = require('winston');
let Elasticsearch = require('winston-elasticsearch');

let elasticsearchTransport = require('restore-winston-elasticsearch-transformer');
let mappingTemplate = elasticsearchTransport.mappingTemplate;
let transformer = elasticsearchTransport.transformer;

/**
 * Restore logger
 * @class
 * @classdesc Logger wraps the winston logger with Restore specifics
 * @param {Object} [conf] - configuration
 */
function Logger(conf) {
  let logger;
  if (conf) {
    logger = conf.get('logger');
  }

  // Set up logging
  winston.log.namespaces = true;
  if (logger) {
    let transports = [];
    for (let transport in logger) {
      switch (transport) {
        case 'console': {
          transports.push(new (winston.transports.Console)(logger.console));
          break;
        }
        case 'file': {
          transports.push(new (winston.transports.File)(logger.file));
          break;
        }
        case 'elasticsearch': {
          let esTransportOpts = logger.elasticsearch;
          esTransportOpts.mappingTemplate = mappingTemplate;
          transformer.source = logger.elasticsearch.source;
          esTransportOpts.transformer = transformer;
          transports.push(new Elasticsearch(esTransportOpts));
          break;
        }
      }
    }
    winston.loggers.add('restore', {
      transports: transports
    });
  }

  let log = winston.loggers.get('restore');

  // Wrapping the winston logger with Restore specifics
  // winston's signature is:

  // ### function log (level, msg, [meta], callback)
  // #### @level {string} Level at which to log the message.
  // #### @msg {string} Message to log
  // #### @meta {Object} **Optional** Additional metadata to attach
  // #### @callback {function} Continuation to respond to when complete.
  // Core logging method exposed to Winston. Metadata is optional.

  // Our signature
  // @level
  // @rstcMeta
  // @msg
  // @meta

  let wrapper = {
    silly: function() {
      log.log.apply(log, ['silly', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    verbose: function() {
      log.log.apply(log, ['verbose', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    debug: function() {
      log.log.apply(log, ['debug', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    info: function() {
      log.log.apply(log, ['info', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    warn: function() {
      log.log.apply(log, ['warn', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    error: function() {
      log.log.apply(log, ['error', generateMessage(arguments), generateMetaObj(arguments)]);
    },
    // Compatibility for using this logger with modules which use
    // a `log()` function.
    log: function() {
      log.log.apply(log, ['info', generateMessage(arguments), generateMetaObj(arguments)]);
    }
  };
  return wrapper;
}

module.exports = Logger;

function generateMessage(args) {
  let message = args[0];
  if (util.isString(message)) {
    Array.prototype.shift.apply(args);
    return message;
  }
}

/**
 * Convert arguments object to real array
 * @param {Array} args
 * @returns {Object} formatted log object
 */
function generateMetaObj(args) {
  let logObj = {};
  for(let k in args) {
    let v = args[k];
    // Winston only inspects metadata in the log function,
    // array of string messages in the second argument of log function
    // won't be inspected automatically. Inspect error objects here manually.
    if (v instanceof Error) {
      v = util.inspect(v);
    }
    logObj[k] = v;
  }
  return logObj;
}
