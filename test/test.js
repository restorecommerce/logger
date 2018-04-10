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

describe('a logger', function () {
  it('can be instantiated', function (done) {
    try {
      logger = new Logger(opts);
      done();
    } catch (err) {
      should.not.exist(err);
    }
  });
  describe('it can be used to log', () => {
    it('a simple message', function (done) {
      logger.info('Simple message');
      done();
    });
    it('a message and an object', function (done) {
      logger.info('Message with an object', { test: 'test' });
      done();
    });
    it('a message and multiple objects', function (done) {
      this.timeout(6000);
      logger.info('Message with multiple object', { test: 'test' }, { test2: 'test2' });
      setTimeout(function () {
        done();
      }, 4000);
    });
  });
});
