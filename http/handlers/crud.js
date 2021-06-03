const { resolveResponse, rejectResponse } = require('../../services/http')
const { create, get, list, update, destroy } = require('../../database/core')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
  'Access-Control-Max-Age': 2592000,
}

const handleRequest = async function ({ url, method, body }, res) {  
  let result
  let error  

  if (['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].indexOf(method) === -1) {
    error = 'bad method'
    return rejectResponse(res, 400, error)
  }
  
  const [ ,model,id ] = url.split('/')

  try {
    switch(method) {
      case 'GET':
        if (id) {
          result = get(model, id)
        } else {
          result = list(model)
        }
      break
      case 'DELETE':
        result = get(model, id)
        destroy(model, id)
      break
      case 'PUT':
        result = update(model, id, body)
      break
      case 'POST':
        result = create(model, body)
      break
      default:
    }

    return resolveResponse(res, headers, result)
  } catch (err) {
    error = err
    return rejectResponse(res, headers, 400, error)
  }
}

module.exports = handleRequest