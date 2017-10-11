const should = require('should');

const Logger = require('../index');

const opts = {
  "loggerName": "test",
  "console": {
    "handleExceptions": false,
    "level": "silly",
    "colorize": true,
    "prettyPrint": true
  }
}

describe('a logger', function() {
  it('can be instantiated', function(done) {
    try {
      logger = new Logger(opts);
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
