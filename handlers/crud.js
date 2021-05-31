const { resolveResponse, rejectResponse, parseRequest } = require('../services/http');
const { getInfos, create, get, list, update, destroy } = require('../database/core');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
  'Access-Control-Max-Age': 2592000,
};

const handleRequest = async function (req, res) {
  const { url, method, body } = await parseRequest(req);
  
  if(url === '/') {
    return resolveResponse(res, headers, { name: "MockRestfulServer", infos: getInfos() });
  }

  const [ ,model,id ] = url.split('/'); 

  let error;  

  if (['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].indexOf(method) === -1) {
    error = 'bad method';
    return rejectResponse(res, 400, error);
  }

  try {
    var result;
    switch(method) {
      case 'GET':
        if (id) {
          result = get(model, id);
        } else {
          result = list(model);
        }
      break;
      case 'DELETE':
        result = get(model, id);
        destroy(model, id);
      break;
      case 'PUT':
        result = update(model, id, body);
      break;
      case 'POST':
        result = create(model, body);
      break;
      default:
    }

    return resolveResponse(res, headers, result);
  } catch (err) {
    error = err;
    return rejectResponse(res, headers, 400, error);
  }
}

module.exports = { handleRequest }