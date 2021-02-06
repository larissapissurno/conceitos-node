const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./index')
const assert = require('assert')

describe('Index Suite tests', () => {
  describe('/users', () => {
    it('should request the users page and return HTTP Status 200', async() => {
      await request(app)
        .get('/users')
        .expect(200)
    })

    it('should request a specific user and return HTTP Status 200', async() => {
      const response = await request(app)
        .get('/users/Larissa')
        .expect(200)

      assert.deepStrictEqual(response.body, 'Larissa');
    })

    it('should try to add a user without a name and return HTTP status 400', async() => {
      const response = await request(app)
        .post('/users')
        .send({name: ''})
        .expect(400)

      const errorResponse = response.body
      const errorResponseTextExpected = 'Name is required'

      assert.deepStrictEqual(errorResponse.error, errorResponseTextExpected)
    });

    it('should try to add a user with a name and return HTTP status 200', async() => {
      const response = await request(app)
        .post('/users')
        .send({name: 'Novo User'})
        .expect(200)

      
      assert.deepStrictEqual(response.body.includes('Novo User'), true)
    });
  })
})