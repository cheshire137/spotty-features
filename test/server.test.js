const request = require('supertest')
const server = require('../src/server')

describe('server', () => {
  test('responds to /', done => {
    request(server).get('/').expect(/Spotty Features/, done)
  })
})
