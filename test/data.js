module.exports = {
  populate: (global) => {
    const id = Date.now();
    
    global.models = {
      records: {
        name: {
          type: 'string',
          required: true
        }
      }
    };
  
    global.credentials = {
      email: "john.doe@gmail.com",
      password: "password",
      repassword: "password"
    };

    global.goodRecordWithoutId = {
      name: "record without id"
    };
  
    global.goodRecordWithId = {
      id,
      name: "record with id"
    };
  
    global.goodRecordWithIdUpdated = {
      id,
      name: "record with id updated"
    };
  
    global.badRecordWithoutRequiredField = {
    };
  
    global.badRecordWithWrongTypeField = {
      name: Date.now()
    };
  
    global.notExistingRecord = {
      id: "bad-id"
    };
  }
 }