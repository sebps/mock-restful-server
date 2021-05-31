const parseRequest = async (req, res) => {
  return new Promise((resolve, reject) => {  
    const { method, url } = req;

    if (['POST', 'PUT'].indexOf(method) !== -1) {
      let data = '';
      let body;
    
      req.on('data', chunk => {
        data += chunk;
      });
    
      req.on('end', () => {
        if(data) body = JSON.parse(data);    
        return resolve({ method, url, body });
      });
    } else {
      return resolve({ method, url });
    }
  })
}

const rejectResponse = (res, headers, status, error) => {
  res.writeHead(status, headers);
  res.end(JSON.stringify({ error }));
}

const resolveResponse = (res, headers, body) => {
  res.writeHead(200, headers);
  res.end(JSON.stringify(body));
}

module.exports = { parseRequest, resolveResponse, rejectResponse };