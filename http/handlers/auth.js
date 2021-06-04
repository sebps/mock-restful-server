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
    error = 'bad method'
    return rejectResponse(res, headers, 400, error)
  }

  if(url === '/login') {
    const { email, password } = body

    if(!email) {
      error = 'email field required'
      return rejectResponse(res, headers, 400, error)      
    }
    if(!password) {
      error = 'password field required'
      return rejectResponse(res, headers, 400, error)
    }

    result = { loggedIn: true, token: 123456789, user: { id:123456789, name:'John Doe', email: 'john.doe@gmail.com' } }
  }
  
  if(url === '/signup') {
    const { email, password, repassword } = body

    if(!email) {
      error = 'email field required'
      return rejectResponse(res, headers, 400, error)      
    }
    if(!password) {
      error = 'password field required'
      return rejectResponse(res, headers, 400, error)
    }
    if(!repassword) {
      error = 'repassword field required'
      return rejectResponse(res, headers, 400, error)
    }
    if(password !== repassword) {
      error = 'passwords doesn\'t'
      return rejectResponse(res, headers, 400, error)
    }

    result = { signedUp: true, user: { id:123456789, name:'John Doe', email: 'john.doe@gmail.com' } }
  }
  
  return resolveResponse(res, headers, result)
}

module.exports = handleRequest