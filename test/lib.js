const { request } = require('http');

exports.request = function(hostname, port, path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: port,
      path: path,
      method: method
    }

    const req = request(options, res => {
      var statusCode = res.statusCode;
      var resBody = "";

       res.on('data', d => {
        resBody += d;
      });

      res.on('error', error => {
        reject(error);
      });
      
      res.on('end', () => {
        resolve({ statusCode, body: resBody });
      });
    });

    req.setHeader('Content-Type', 'application/json');
    if(body) req.write(JSON.stringify(body));
    req.end();
  })
}