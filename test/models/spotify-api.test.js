const SpotifyApi = require('../../src/models/spotify-api')

test('uses given token in auth header', () => {
  const api = new SpotifyApi('123abc')
  expect(api.headers.Authorization).toBe('Bearer 123abc')
})
