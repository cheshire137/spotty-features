const request = require('supertest')
const server = require('../src/server')

function handleFailure(err, res, done) {
  if (err) return done.fail(err)
  done()
}

describe('server', () => {
  test('responds to /', done => {
    request(server).get('/').expect(/Spotty Features/).
      end((err, res) => handleFailure(err, res, done))
  })

  test('serves static assets', done => {
    request(server).get('/style.css').expect(/body {/, done)
    request(server).get('/config.json').expect('Content-Type', /json/).
      expect(200).end((err, res) => handleFailure(err, res, done))
  })

  test('routes other URLs to index.html', done => {
    const routes = ['/auth', '/spotify']
    for (const route of routes) {
      request(server).get(route).expect(/Spotty Features/).
        end((err, res) => handleFailure(err, res, done))
    }
  })
})
