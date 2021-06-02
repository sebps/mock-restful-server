const collections = {}
const structures = {}
const models = []
var mode

const boot = (bootMode) => {
  mode = bootMode
}

const registerModel = (name, structure = {}) => {
  collections[name] = {}
  structures[name] = structure 
  models.push(name)
}

const getInfos = () => {
  return { collections: models, structures }
}

const checkModelExistence = (model) => {
  if(models.indexOf(model) === -1) {
    if(mode === 'STRICT') throw `${model} : model not exists`
    else if(mode === 'OPEN') registerModel(model)
  }
}

const checkRecordExistence = (model, id, mustExist) => {
  const record = collections[model][id]

  if (record && !mustExist) throw `${model} : record already exists`
  if (!record && mustExist) throw `${model} : record not exists`
}

const checkRecordConsistency = (model, record) => {
  const structure = structures[model]

  Object.keys(structure).forEach((field) => {
    const { required, type } = structure[field]

    if(required && !record[field]) throw `${model} : required field : ${field}`

    if(record[field] && type) {
      switch(type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'object':
          if (typeof record[field] !== type) throw `${model} : wrong field type : ${field}`
        break
        case 'map':
          if (typeof record[field] !== 'object') throw `${model} : wrong field type : ${field}`
        break
        case 'array':
          if (!Array.isArray(record[field])) throw `${model} : wrong field type : ${field}`
        break
      }
    }
  })
  
  if(mode === 'STRICT') {
    Object.keys(record).forEach((field) => {
      if(!structure[field]) throw `${model} : field not defined in model : ${field}`
    })
  }
}

const create = (model, object) => {
  checkModelExistence(model)

  const record = Object.assign({}, object)

  if(record.id) {
    checkRecordExistence(model, record.id.toString(), false)
  } else {
    record.id = '' + Date.now()
  }

  checkRecordConsistency(model, record)

  collections[model][record.id] = record

  return record
}

const get = (model, id) => {
  checkModelExistence(model)
  checkRecordExistence(model, id, true)

  const record = collections[model][id]  

  return record
}

const update = (model, id, object) => {
  checkModelExistence(model)
  checkRecordExistence(model, id, true)

  const newRecord = Object.assign({}, collections[model][id], object)

  checkRecordConsistency(model, newRecord)

  collections[model][id] = newRecord

  return newRecord
}

const destroy = (model, id) => {
  checkModelExistence(model)
  checkRecordExistence(model, id, true)

  const oldRecord = Object.assign({}, collections[model][id])
  
  delete collections[model][id]

  return oldRecord
}

const list = (model) => {
  checkModelExistence(model)

  const records = Object.values(collections[model])

  return records
}

module.exports = { boot, registerModel, getInfos, create, get, update, destroy, list }