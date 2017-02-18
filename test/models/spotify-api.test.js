import fetchMock from 'fetch-mock'

import Config from '../../src/public/config'
import MeResponse from '../fixtures/spotify/me'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import SpotifyApi from '../../src/models/spotify-api'
import TrackSearchResponse from '../fixtures/spotify/track-search'

describe('SpotifyApi', () => {
  test('uses given token in auth header', () => {
    const api = new SpotifyApi('123abc')
    expect(api.headers.Authorization).toBe('Bearer 123abc')
  })

  test('gets info about the user', () => {
    fetchMock.get(`${Config.spotify.apiUrl}/me`, MeResponse)

    const api = new SpotifyApi('123abc')
    return api.me().then(data => {
      expect(data).toEqual(MeResponse)
    })
  })

  test('searches tracks', () => {
    const path = 'search?q=scream%20grimes&type=track&limit=1&offset=0'
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, TrackSearchResponse)

    const opts = {
      limit: 1,
      offset: 0,
      q: 'scream grimes',
      type: 'track'
    }
    const api = new SpotifyApi('123abc')
    return api.search(opts).then(data => {
      expect(data).toEqual(TrackSearchResponse)
    })
  })

  test('gets track recommendations', () => {
    const path = 'recommendations?limit=1&seed_tracks=6DLJQz0hav4l4VfEjJze5T' +
      '&target_acousticness=0.26&target_danceability=0.595&target_energy=0.649' +
      '&target_valence=0.376&target_instrumentalness=0.00143' +
      '&target_liveness=0.166&target_speechiness=0.0247'
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, RecommendationsResponse)

    const opts = {
      limit: 1,
      seed_tracks: '6DLJQz0hav4l4VfEjJze5T',
      target_acousticness: 0.26,
      target_danceability: 0.595,
      target_energy: 0.649,
      target_valence: 0.376,
      target_instrumentalness: 0.00143,
      target_liveness: 0.166,
      target_speechiness: 0.0247
    }
    const api = new SpotifyApi('123abc')
    return api.getRecommendations(opts).then(data => {
      expect(data).toEqual(RecommendationsResponse)
    })
  })
})
