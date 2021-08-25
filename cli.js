#!/usr/bin/env node
const process = require('process')
const { start } = require('.')
const { readFileSync } = require('fs')

var models
var port
var data
var mode

setTimeout(() => {
  for (const arg of process.argv) {
    if(arg.split('=').length !==2 ) continue
  
    [ name, value ] = arg.split('=')
  
    switch(name) {
      case 'models':
      case '-models':
      case '--models':
        rawModels = readFileSync(value)
        models = JSON.parse(rawModels)
        break
      case 'data':
      case '-data':
      case '--data':
        rawData = readFileSync(value)
        data = JSON.parse(rawData)        
      break
      case 'port':
      case '-port':
      case '--port':
        port = value 
      break
      case 'mode':
      case '-mode':
      case '--mode':
        mode = value 
      break
    }
  }
  
  if(!models) throw new Error('argument --models required')
  
  start(models, data, mode, port)
}, 3000)