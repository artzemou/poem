const request = require('supertest')
const app = require('../app')
const assert = require('assert')

describe('Test the root path', () => {
  it('It should response 200', async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect(({text}) => {
        expect(text).toContain("boa")
      })
  })
})

describe('Test 404 redirection', () => {
  it('It should response 404', async () => {
    await request(app).get('/hkljhk').expect(302)
  })
})
