const { resolveResponse, rejectResponse } = require('../../services/http')
const { generateDatabase } = require('../../services/database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
  'Access-Control-Max-Age': 2592000,
}

const handleRequest = async function ({ query, method, body }, res) {    
  let result
  let error  

  if (['POST', 'PUT', 'OPTIONS'].indexOf(method) === -1) {
    error = 'bad method'
    return rejectResponse(res, headers, 400, error)
  }

  try {
    switch(method) {
      case 'POST':
      case 'PUT': 
      default:
        result = generateDatabase()
      break
    }

    return resolveResponse(res, headers, result)
  } catch (err) {
    error = err
    return rejectResponse(res, headers, 400, error)
  }
}

module.exports = handleRequest