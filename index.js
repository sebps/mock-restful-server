const http = require('http')
const { handleRequest } = require('./http/router')
const { bootDatabase, populateDatabase } = require('./services/database')

exports.start = async (models, data, mode = 'OPEN', port = 0) => {
  let server
  let sockets

  bootDatabase(mode)
  populateDatabase(models, data)
  
  const stop = () => {
    for (const socket of sockets) {
      socket.destroy()
  
      sockets.delete(socket)
    }
  
    server.close()
  }

  const listening = await new Promise((resolve, reject) => {   
    server = http.createServer(handleRequest)
    sockets = new Set()

    server.listen(port, (err) => {
      if (err) return reject(err)
      resolve(server.address().port)
    })

    server.on('connection', (socket) => {
      sockets.add(socket)
    
      server.once('close', () => {
        sockets.delete(socket)
      })
    })
  })

  console.log(`Mock restful server listening at http://localhost:${listening}`)
  return { port: listening, stop }
}