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

### Server infos
- Model structure infos 
GET http://{address}:{port}

### CRUD
- Get collection records
GET http://{address}:{port}/{collection}
- Get collection record
GET http://{address}:{port}/{id}
- Create collection record
POST http://{address}:{port}/
- Update collection record
PUT http://{address}:{port}/{id}
- Delete collection record
DELETE http://{address}:{port}/{collection}/{id}

### Authentication
- Signup 
POST http://{address}:{port}/signup
- Login
POST http://{address}:{port}/login

*Note: /login and /signup routes are reserved for authentication related mocking. 

## Usage

### Lib mode

```sh
$ npm install mock-restful-server
```

#### Methods signatures
```js
function start(models, data, mode, port = 0)
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

*Note: supported model attributes are "type" and "required". type can be either "number", "string", "boolean", "array" or "map".

```js
const data = {
  users: [{
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    address: 'Central Park Lake, NY'
  }],
  cars: [{
    name: 'Mustang'
    brand: 'Ford',
    year: '1970'
  }]
}
```

```js
const mode = 'STRICT'
```

*Note: supported modes are STRICT and OPEN. OPEN is the default mode. In STRICT mode, two case will lead the server to throw an exception at saving time : trying to save a record with no model previously defined and trying to save a record having at least one field which doesn't exist in its model structure.

```js
const { port, stop } = mockRestfulServer.start(models, data, mode, 8080)
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
$ mock-restful-server --models=models.json --data=data.json --mode=STRICT --port=8080
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-parallelizer
