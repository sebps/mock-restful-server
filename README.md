# MockRestfulServer

mock-restful-server
==========

A lightweight restful api mock server using models. 

<!-- TOC -->

- [Features](#features)
- [API](#api)
- [Usage](#usage)
    - [LIB mode](#lib-mode)
    - [CLI mode](#cli-mode)
- [License](#license)

<!-- /TOC -->

## Features
- Models management
- CRUD operations

## API
- Model structure infos 
GET http://<address>:<port>/
- Get collection records
GET http://<address>:<port>/<collection>
- Get collection record
GET http://<address>:<port>/<id>
- Create collection record
POST http://<address>:<port>/
- Update collection record
PUT http://<address>:<port>/<id>
- Delete collection record
DELETE http://<address>:<port>/<collection>/<id>

## Usage

### Lib mode

```sh
$ npm install mock-restful-server
```

#### Methods signatures
```js
function start(models, port = 0)
```

*Note: without specifying the port argument a random port will be allocated by the system. The server listening address will be logged in the console at start.

#### Example
```js
const mockRestfulServer = require('mock-restful-server');
```

```js
const models = {
  users: {
    email: {
      type: "string",
      required: true
    },
    name: {
      type: "string",
      required: true
    },
    address: {
      type: "string"
    }
  },
  cars: {
    name: {
      type: "string",
      required: true
    },
    brand: {
      type: "string",
      required: true
    },
    year: {
      type: "number"
    }
  }
}
```

```js
const { port, stop } = mockRestfulServer.start(models, 8080)
```

```js
// stop the server 
stop()
```
### CLI mode
```sh
$ npm install -g mock-restful-server
```

```sh
$ mock-restful-server --models=models.json --port=8080
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-parallelizer
