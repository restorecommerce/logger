"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_elasticsearch_1 = __importDefault(require("winston-elasticsearch"));
const winstonESTransformer = __importStar(require("@restorecommerce/winston-elasticsearch-transformer"));
const rTracer = __importStar(require("cls-rtracer"));
const winston_1 = require("./winston");
const mappingTemplate = winstonESTransformer.mappingTemplate;
const transformer = winstonESTransformer.transformer;
const { timestamp, printf } = winston_1.format;
// a custom format that outputs request id
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
        ? `${level} : ${time} [rid:${rid}] : ${message} ${((object))}`
        : `${level} : ${time} : ${message} ${(object)}`;
});
class Logger extends winston_1.WinstonLogger {
    constructor(opts) {
        // Set up logging
        winston_1.log.namespaces = true;
        if (!opts)
            throw new Error('Options are missing');
        // Provide TransportStream array and add opts.transports
        let transports = [];
        if (opts.transports && !Array.isArray(transports)) {
            transports = [transports];
        }
        else if (Array.isArray(opts.transports)) {
            transports = opts.transports;
        }
        let transportsCount = 0;
        Object.keys(opts).forEach((transport) => {
            switch (transport) {
                case 'console': {
                    const consoleOpts = Object.assign(Object.assign({}, opts[transport]), { format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple(), timestamp(), rTracerFormat) });
                    transportsCount++;
                    transports.push(new winston_1.Transports.Console(consoleOpts));
                    break;
                }
                case 'file': {
                    transportsCount++;
                    transports.push(new winston_1.Transports.File(opts[transport]));
                    break;
                }
                case 'elasticsearch': {
                    transportsCount++;
                    const elasticsearchOpts = Object.assign({ mappingTemplate }, opts[transport]);
                    transformer.source = opts.elasticsearch.source;
                    elasticsearchOpts.transformer = transformer;
                    transports.push(new winston_elasticsearch_1.default(elasticsearchOpts));
                    break;
                }
                default:
                // ignore
            }
        });
        if (transportsCount <= 0) {
            throw new Error('Provide at least one supported transport');
        }
        super(Object.assign(Object.assign({}, opts), { transports }));
    }
}
exports.Logger = Logger;
