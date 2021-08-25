const { boot, registerModel, getStructures, create, getCollections } = require('../database/core')
const words = require('../words.json')

const bootDatabase = (mode) => {
  boot(mode)
}

const populateDatabase = (models, data) => {
  if (models) {
    Object.keys(models).forEach(model => registerModel(model, models[model]))
  }
  if (data) {
    Object.keys(data).forEach((model) => {
      if(!models || !models[model]) registerModel(model)
      data[model].forEach((item) => {
        create(model, item)
      })
    })
  }
}

const generateDatabase = (size = 1000) => {
  const structures = getStructures()

  for (const [model, structure] of Object.entries(structures)) {
    let i = 0
    
    while(i < size) {
      const record = {}

      for (const [fieldName, fieldInfos] of Object.entries(structure)) {
        const { type } = fieldInfos 

        let random 

        switch(type){
          case 'string':
            random = words[Math.floor(Math.random() * 1000)]
          break
          case 'number':
            random = Math.floor(Math.random() * 1000)
          break
          case 'boolean':
            random = Math.floor(Math.random() * 2)
          break
          case 'object':
          case 'map':
            random = {
              [words[Math.floor(Math.random() * 1000)]]: words[Math.floor(Math.random() * 1000)],
              [words[Math.floor(Math.random() * 1000)]]: words[Math.floor(Math.random() * 1000)],
              [words[Math.floor(Math.random() * 1000)]]: words[Math.floor(Math.random() * 1000)]
            } 
          break
          case 'array':
            random = [
              words[Math.floor(Math.random() * 1000)],
              words[Math.floor(Math.random() * 1000)],
              words[Math.floor(Math.random() * 1000)]
            ]
          break
        }

        record[fieldName] = random 
      }

      create(model, record)

      i++
    }
  }

  return { generated: true }
}

const dumpDatabase = () => {
  const collections = getCollections()
  return collections
}

module.exports = { bootDatabase, populateDatabase, generateDatabase, dumpDatabase }