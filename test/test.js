const expect = require('chai').expect
const assert = require('assert')
const { start } = require('../index')
const { request } = require('./lib')
const { populate } = require('./data')

describe('Mock Restful Server', function() {
  this.timeout(60000)

  before(function(done) {
    populate(global)
    start(global.models, null, 'STRICT').then(({ port, stop }) => {
      global.port = port
      global.stop = stop
      done()
    })
  })

  after(function() {
    global.stop()
  })

  describe('Mode STRICT', function() {
    describe('Signup', function() {
      it('Should be successful and respond with a succesful signup confirmation', async function() {
        const { statusCode, body } = await request('localhost', port, '/signup', 'POST', global.credentials)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.have.property('signedUp')
        expect(parsedBody.signedUp).to.equal(true)
      })
    })
  
    describe('Login', function() {
      it('Should be successful and respond with a succesful signup confirmation', async function() {
        const { statusCode, body } = await request('localhost', port, '/login', 'POST', global.credentials)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.have.property('loggedIn')
        expect(parsedBody).to.have.property('token')
        expect(parsedBody.loggedIn).to.equal(true)
      })
    })
  
    describe('Create', function() {
      it('Should return a model not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, '/wrong-model', 'POST', global.goodRecordWithId)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`wrong-model : model not exists`)
      })
  
      it('Should be successful and respond with the record with a new id', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'POST', global.goodRecordWithoutId)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.have.property('id')
        expect(parsedBody).to.deep.equal(Object.assign({ id: parsedBody.id }, global.goodRecordWithoutId))
        global.goodRecordWithoutId.id = parsedBody.id
      })
  
      it('Should be successful and respond with the record', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'POST', global.goodRecordWithId)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.deep.equal(global.goodRecordWithId)
      })
  
      it('Should return an id already exists error', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'POST', global.goodRecordWithId)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : record already exists`)
      })
  
      it('Should return a field required error', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'POST', global.badRecordWithoutRequiredField)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : required field : name`)
      })
  
      it('Should return a wrong field type error', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'POST', global.badRecordWithWrongTypeField)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : wrong field type : name`)
      })    
    })
  
    describe('Get', function() {
      it('Should return a model not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, `/wrong-model/${global.goodRecordWithId.id}`, 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`wrong-model : model not exists`)
      })
  
      it('Should be successful and respond with the right record', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.goodRecordWithId.id}`, 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.deep.equal(Object.assign({ id: parsedBody.id }, global.goodRecordWithId))
      })
  
      it('Should return a record not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.notExistingRecord.id}`, 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : record not exists`)
      }) 
    })
  
    describe('List', function() {
      it('Should return a model not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, '/wrong-model', 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`wrong-model : model not exists`)
      })
  
      it('Should be successful and respond with the right list of records', async function() {
        const { statusCode, body } = await request('localhost', port, '/records', 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.deep.equal([
          global.goodRecordWithoutId,
          global.goodRecordWithId
        ])
      })
    })
  
    describe('Update', function() {
      it('Should return a model not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, `/wrong-model/${global.goodRecordWithId.id}`, 'PUT', global.goodRecordWithIdUpdated)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`wrong-model : model not exists`)
      })
  
      it('Should be successful and respond with the record updated', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${goodRecordWithId.id}`, 'PUT', global.goodRecordWithIdUpdated)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.have.property('id')
        expect(parsedBody).to.deep.equal(global.goodRecordWithIdUpdated)
      })
  
      it('Should be successful and respond with the record updated', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.goodRecordWithIdUpdated.id}`, 'GET')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.deep.equal(global.goodRecordWithIdUpdated)
      })
  
      it('Should return a wrong field type error', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.goodRecordWithIdUpdated.id}`, 'PUT', global.badRecordWithWrongTypeField)
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : wrong field type : name`)
      })   
    })
  
    describe('Delete', function() {
      it('Should return a model not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, `/wrong-model/${global.goodRecordWithId.id}`, 'DELETE')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`wrong-model : model not exists`)
      })
  
      it('Should be successful and respond with the right record', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.goodRecordWithId.id}`, 'DELETE')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(200)
        expect(parsedBody).to.deep.equal(global.goodRecordWithIdUpdated)
      })
  
      it('Should return a record not exists error', async function() {
        const { statusCode, body } = await request('localhost', port, `/records/${global.goodRecordWithId.id}`, 'DELETE')
        const parsedBody = JSON.parse(body)
        expect(statusCode).to.equal(400)
        expect(parsedBody).to.have.property('error')
        expect(parsedBody.error).to.deep.equal(`records : record not exists`)
      })
    })
  })
})