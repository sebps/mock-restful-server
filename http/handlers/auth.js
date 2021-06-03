const { resolveResponse, rejectResponse } = require('../../services/http');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Max-Age': 2592000,
}

const handleRequest = async function ({ url, method, body }, res) {
  let result 
  let error

  if (['POST', 'OPTIONS'].indexOf(method) === -1) {
    error = 'bad method';
    return rejectResponse(res, 400, error);
  }

  if(url === '/login') {
    result = { loggedIn: true, token: 123456789 }
  }
  
  if(url === '/signup') {
    result = { signedUp: true }
  }
  
  return resolveResponse(res, headers, result)
}

module.exports = handleRequest