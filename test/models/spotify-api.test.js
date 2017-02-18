import fetchMock from 'fetch-mock'
import MockDate from 'mockdate'

import SpotifyApi from '../../src/models/spotify-api'

import AddTracksToPlaylistResponse from '../fixtures/spotify/add-tracks-to-playlist'
import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import Config from '../../src/public/config'
import CreatePlaylistResponse from '../fixtures/spotify/create-playlist'
import MeResponse from '../fixtures/spotify/me'
import MultiAudioFeaturesResponse from '../fixtures/spotify/multi-audio-features'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'
import SavedTracksResponse2 from '../fixtures/spotify/saved-tracks2'
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

  test('gets audio features for specified tracks', () => {
    const id1 = '4nDfc6F2uVcc6wdG7kBzWO'
    const id2 = '6cgvDYk7YGQTVfd5jsw0Qw'

    const path = `audio-features?ids=${id1},${id2}`
    fetchMock.get(`${Config.spotify.apiUrl}/${path}`, MultiAudioFeaturesResponse)

    const api = new SpotifyApi('123abc')
    return api.audioFeatures([id1, id2]).then(data => {
      expect(data).toEqual(MultiAudioFeaturesResponse.audio_features)
    })
  })

  test("creates a playlist in the user's account", () => {
    const userID = 'cheshire137'

    const path1 = `users/${userID}/playlists`
    fetchMock.post(`${Config.spotify.apiUrl}/${path1}`, CreatePlaylistResponse)

    const path2 = `users/${userID}/playlists/${CreatePlaylistResponse.id}/tracks`
    fetchMock.post(`${Config.spotify.apiUrl}/${path2}`, AddTracksToPlaylistResponse)

    const trackURIs = [
      'spotify:track:4FULAlQuDeDlv1FidteGv0',
      'spotify:track:4nDfc6F2uVcc6wdG7kBzWO',
      'spotify:track:4r9uaA43qfASToQ959KwDt'
    ]
    const opts = {
      name: 'test playlist pls ignore',
      public: true,
      collaborative: false
    }
    const api = new SpotifyApi('123abc')
    return api.createPlaylist(userID, trackURIs, opts).then(data => {
      const expected = CreatePlaylistResponse
      expected.snapshot_id = AddTracksToPlaylistResponse.snapshot_id
      expect(data).toEqual(expected)
    })
  })
})
