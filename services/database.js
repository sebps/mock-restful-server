const { boot, registerModel, create } = require('../database/core')

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

module.exports = { bootDatabase, populateDatabase }