import fetchMock from 'fetch-mock'

import Config from '../../src/public/config'
import MeResponse from '../fixtures/spotify/me'
import SpotifyApi from '../../src/models/spotify-api'

describe('SpotifyApi', () => {
  test('uses given token in auth header', () => {
    const api = new SpotifyApi('123abc')
    expect(api.headers.Authorization).toBe('Bearer 123abc')
  })

  test('gets info about the user', () => {
    fetchMock.get(`${Config.apiUrl}/me`, MeResponse)

    const api = new SpotifyApi('123abc')
    return api.me().then(data => {
      expect(data).toEqual(MeResponse)
    })
  })
})
