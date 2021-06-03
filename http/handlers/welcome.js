const { resolveResponse } = require('../../services/http')
const { getInfos } = require('../../database/core')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET',
  'Access-Control-Max-Age': 2592000,
}

const handleRequest = ({ url, method, body }, res) => {
  return resolveResponse(res, headers, { name: "MockRestfulServer", infos: getInfos() })
} 

module.exports = handleRequest