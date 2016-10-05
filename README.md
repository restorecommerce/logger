# logger

Opinionated wrapper for the [winston](https://github.com/winstonjs/winston)
logging toolkit.

Supported transports:

- [Elasticsearch transport](https://github.com/vanthome/winston-elasticsearch) using a [specific transformer](https://github.com/restorecommerce/winston-elasticsearch-transformer)
- Console (Winston built-in)
- File (Winston built-in)

The following log levels are supported:

- silly
- verbose
- debug
- info
- warn
- error

## Usage

see [test.js](test/test.js).
