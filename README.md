# logger

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

The wrapper has methods that correspond to the following levels:

- silly
- verbose
- debug
- info
- warn
- error

In addition there is a `log()` function.

## Usage

see [test.js](test/test.js) and the
[Winston documentation](https://github.com/winstonjs/winston).
