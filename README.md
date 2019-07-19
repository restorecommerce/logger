# logger

<img src="http://img.shields.io/npm/v/%40restorecommerce%2Flogger.svg?style=flat-square" alt="">[![Build Status][build]](https://travis-ci.org/restorecommerce/logger?branch=master)[![Dependencies][depend]](https://david-dm.org/restorecommerce/logger)[![Coverage Status][cover]](https://coveralls.io/github/restorecommerce/logger?branch=master)

[version]: http://img.shields.io/npm/v/logger.svg?style=flat-square
[build]: http://img.shields.io/travis/restorecommerce/logger/master.svg?style=flat-square
[depend]: https://img.shields.io/david/restorecommerce/logger.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/restorecommerce/logger/master.svg?style=flat-square

Opinionated wrapper and configurator for the
[winston](https://github.com/winstonjs/winston) logging toolkit.

The following transports are supported:

- [Elasticsearch transport](https://github.com/vanthome/winston-elasticsearch) using a [specific transformer](https://github.com/restorecommerce/winston-elasticsearch-transformer)
- Console (Winston built-in transport)
- File (Winston built-in transport)

These transports can be added and configured with a corresponding property in
the options hash:

```json
  "console": {
    "handleExceptions": false,
    "level": "silly",
    "colorize": true,
    "prettyPrint": true
  },
  "file": {
    ...
  },
  "elasticsearch": {
    ...
  }
```

The logger has methods that correspond to the following levels:

- silly
- verbose
- debug
- info
- warn
- error

In addition there is a generic `log()` function.

NOTE: For `Console` logger a custom format is defined that outputs the rid (request-id) if it is set using [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer) module.

## Usage

The assumption with this logger is that the log statements are built like this:

```js
logger.info('Textual message');

// or

logger.info({ key: 'value' });

// or

logger.info('Textual message', { key: 'value' });
```

No other variants are supported.

See [test.ts](test/test.ts) and the
[Winston documentation](https://github.com/winstonjs/winston).
