import fetchMock from 'fetch-mock'
import MockDate from 'mockdate'

import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import Config from '../../src/public/config'
import MeResponse from '../fixtures/spotify/me'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'
import SavedTracksResponse2 from '../fixtures/spotify/saved-tracks2'
import SpotifyApi from '../../src/models/spotify-api'
import TopTracksResponse from '../fixtures/spotify/top-tracks'
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

  test("gets the user's saved tracks", () => {
    const path = 'me/tracks?limit=1&offset=0'
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, SavedTracksResponse)

    const opts = { limit: 1, offset: 0 }
    const api = new SpotifyApi('123abc')
    return api.savedTracks(opts).then(data => {
      expect(data).toEqual(SavedTracksResponse)
    })
  })

  test("gets the user's top tracks", () => {
    const path = 'me/top/tracks?limit=1&offset=0'
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, TopTracksResponse)

    const opts = { limit: 1, offset: 0 }
    const api = new SpotifyApi('123abc')
    return api.topTracks(opts).then(data => {
      expect(data).toEqual(TopTracksResponse)
    })
  })

  test("gets the user's saved tracks for the past month", () => {
    MockDate.set('3/15/2017')

    const path1 = 'me/tracks?limit=50&offset=0'
    fetchMock.get(`${Config.spotify.apiUrl}/${path1}`, SavedTracksResponse)

    const path2 = 'me/tracks?limit=50&offset=50'
    fetchMock.get(`${Config.spotify.apiUrl}/${path2}`, SavedTracksResponse2)

    const api = new SpotifyApi('123abc')
    return api.savedTracksForPastMonths(1).then(data => {
      expect(data).toBeInstanceOf(Array)
      expect(data).toHaveLength(1)
      expect(data[0].track).toEqual(SavedTracksResponse.items[0].track)
    })
  })

  test("fetches specified weeks' worth of user's saved tracks", () => {
    const path = 'me/tracks?limit=50&offset=0'
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, SavedTracksResponse)

    const api = new SpotifyApi('123abc')
    return api.savedTracksForXWeeks(1).then(data => {
      expect(data).toBeInstanceOf(Array)
      expect(data).toHaveLength(1)
      expect(data[0].track).toEqual(SavedTracksResponse.items[0].track)
    })
  })

  test('get audio features for a track', () => {
    const trackID = '4nDfc6F2uVcc6wdG7kBzWO'
    const path = `audio-features/${trackID}`
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, AudioFeaturesResponse)

    const api = new SpotifyApi('123abc')
    return api.audioFeaturesForTrack(trackID).then(data => {
      expect(data).toEqual(AudioFeaturesResponse)
    })
  })
})
