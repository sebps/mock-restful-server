const collections = {};
const structures = {};
const models = [];

const registerModel = (name, structure = {}) => {
  collections[name] = {};
  structures[name] = structure; 
  models.push(name);
}

const getInfos = () => {
  return { collections: models, structures };
}

const checkModelExistence = (model) => {
  if(models.indexOf(model) === -1) throw `${model} : model not exists`;
}

const checkRecordExistence = (model, id, mustExist) => {
  const record = collections[model][id];

  if (record && !mustExist) throw `${model} : record already exists`;
  if (!record && mustExist) throw `${model} : record not exists`;
}

const checkRecordConsistence = (model, record) => {
  const structure = structures[model];

  Object.keys(structure).forEach((field) => {
    const constraints = structure[field];

    if(constraints.required && !record[field]) throw `${model} : required field : ${field}`;
    if(record[field] && constraints.type && typeof record[field] !== constraints.type) throw `${model} : wrong field type : ${field}`;
  })
}

const create = (model, object) => {
  checkModelExistence(model);

  const record = Object.assign({}, object);

  if(record.id) {
    checkRecordExistence(model, record.id.toString(), false)
  } else {
    record.id = "" + Date.now();
  }

  checkRecordConsistence(model, record);

  collections[model][record.id] = record;

  return record;
}

const get = (model, id) => {
  checkModelExistence(model);
  checkRecordExistence(model, id, true);

  const record = collections[model][id];  

  return record;
}

const update = (model, id, object) => {
  checkModelExistence(model);
  checkRecordExistence(model, id, true);

  const newRecord = Object.assign({}, collections[model][id], object);

  checkRecordConsistence(model, newRecord);

  collections[model][id] = newRecord;

  return newRecord;
}

const destroy = (model, id) => {
  checkModelExistence(model);
  checkRecordExistence(model, id, true);

  const oldRecord = Object.assign({}, collections[model][id]);
  
  delete collections[model][id];

  return oldRecord;
}

const list = (model) => {
  checkModelExistence(model);

  const records = Object.values(collections[model]);

  return records;
}

module.exports = { registerModel, getInfos, create, get, update, destroy, list };