"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const should = __importStar(require("should"));
const index_1 = require("../index");
const opts = {
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
            let logger = new index_1.Logger(opts);
            done();
        }
        catch (err) {
            should.not.exist(err);
        }
    });
    describe('it can be used to log', () => {
        let logger = new index_1.Logger(opts);
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
            logger.log('debug', 'Message with multiple object', { test: 'test' }, { test2: 'test2' });
            done();
        });
    });
});
