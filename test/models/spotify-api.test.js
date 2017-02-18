import fetchMock from 'fetch-mock'

import SpotifyApi from '../../src/models/spotify-api'

import MeResponse from '../fixtures/spotify/me'

describe('SpotifyApi', () => {
  test('uses given token in auth header', () => {
    const api = new SpotifyApi('123abc')
    expect(api.headers.Authorization).toBe('Bearer 123abc')
  })

  test('gets info about the user', () => {
    fetchMock.get('*', MeResponse)

    const api = new SpotifyApi('123abc')
    return api.me().then(data => {
      expect(data).toEqual(MeResponse)
    })
  })
})
