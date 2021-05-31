const http = require('http');
const { registerModel } = require('./database/core');
const { handleRequest } = require('./handlers/crud');

exports.start = async (models, port = 0) => {
  let server;
  let sockets;

  const stop = () => {
    for (const socket of sockets) {
      socket.destroy();
  
      sockets.delete(socket);
    }
  
    server.close();
  }

  const listening = await new Promise((resolve, reject) => {
    if(Array.isArray(models)) {
      models.forEach(model => registerModel(model));
    } else {
      Object.keys(models).forEach(key => registerModel(key, models[key]));
    }

    server = http.createServer(handleRequest);
    sockets = new Set();

    server.listen(port, (err) => {
      if (err) return reject(err);
      resolve(server.address().port);
    });

    server.on('connection', (socket) => {
      sockets.add(socket);
    
      server.once('close', () => {
        sockets.delete(socket);
      });
    });
  });

  console.log(`Mock restful server listening at http://localhost:${listening}`);
  return { port: listening, stop };
}