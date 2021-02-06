const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./index')
const assert = require('assert')

describe('Index Suite tests (End-to-End)', () => {
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

    it('should be able to edit an user', async() => {
      const response = await request(app)
        .put('/users/0')
        .send({name: 'Larissa editadah'})
        .expect(200)
      
      assert.deepStrictEqual(response.body[0], 'Larissa editadah')
    });

    it('should not be able to edit an user if he does not exists', async() => {
      const response = await request(app)
        .put('/users/999')
        .send({name: 'Larissa editadah'})
        .expect(400)
      
        const errorResponse = response.body
        const errorResponseTextExpected = 'User does not exists'
  
        assert.deepStrictEqual(errorResponse.error, errorResponseTextExpected)
    });

    it('should be able to delete an user', async() => {
      const username = 'Novo User A Ser Deletado'
      let users = await request(app)
        .post('/users')
        .send({name: username})
        .expect(200)

      const newUserIndex = users.body.indexOf(username);
      
      await request(app)
        .delete(`/users/${newUserIndex}`)
        .expect(200)
      
      users = await request(app).get('/users')

      assert.deepStrictEqual(users.body.includes(username), false)
    });
  })
})