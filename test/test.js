const should = require('should');
//const winston = require('winston');

const Logger = require('../index');

const config = {
  "logger": {
    "console": {
      "handleExceptions": false,
      "level": "silly",
      "colorize": true,
      "prettyPrint": true
    }
  }
}

const cfg = {
  value: config.logger,
  get: function() {
    return this.value;
  },
}

let logger = null;

describe('a logger', function() {
  it('can be instantiated', function(done) {
    try {
      logger = new Logger(cfg);
      done();
    } catch (err) {
      should.not.exist(err);
    }
  });
  it('can be used to log', function(done) {
    logger.info('test', { test: 'test' });
    done();
  });
});
