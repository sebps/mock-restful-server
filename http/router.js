const { parseRequest } = require('../services/http');
const { auth, crud, welcome, randomize, dump } = require('./handlers');

const handleRequest = async function (req, res) {
  const { url, method, body } = await parseRequest(req)

  switch (url) {
    case '/':
      return welcome({ url, method, body }, res)
    case '/login':
    case '/signup':
      return auth({ url, method, body }, res)
    case '/_randomize':      
     return randomize({ url, method, body }, res)
     case '/_dump':      
     return dump({ url, method, body }, res)     
    default:
      return crud({ url, method, body }, res)
  }
}

module.exports = { handleRequest }