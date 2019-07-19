
import * as should from 'should';
import { Logger } from '../index';

const opts: any = {
  loggerName: 'test',
  console: {
    handleExceptions: false,
    level: 'silly',
    colorize: true,
    prettyPrint: true
  }
};

describe('a logger', function () {
  it('can be instantiated', function (done) {
    try {
      let logger = new Logger(opts);
      done();
    } catch (err) {
      should.not.exist(err);
    }
  });
  describe('it can be used to log', () => {
    let logger = new Logger(opts);
    it('a simple message', function (done) {
      logger.info('Simple message');
      done();
    });
    it('a message and an object', function (done) {
      logger.info('Message with an object', { test: 'testMessage' });
      done();
    });
    it('an Object', function (done) {
      logger.info({ test: 'test' });
      done();
    });
    it('log with level, a message and object', function (done) {
      logger.log('debug', 'Message with multiple object', { test: 'test' },
        { test2: 'test2' });
      done();
    });
  });
});
