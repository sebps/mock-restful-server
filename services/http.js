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

const rejectResponse = (res, status, error) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify({ error }));
}

const resolveResponse = (res, body) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(body));
}

module.exports = { parseRequest, resolveResponse, rejectResponse };