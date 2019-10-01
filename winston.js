"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
var winston_2 = require("winston");
exports.Transports = winston_2.transports;
exports.format = winston_2.format;
exports.log = winston_2.log;
class WinstonLoggerClass {
    constructor(opts) {
        const logger = winston_1.createLogger(opts);
        Object.setPrototypeOf(this, logger);
    }
}
exports.WinstonLogger = WinstonLoggerClass;
