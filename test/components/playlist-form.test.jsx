import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import PlaylistForm from '../../src/components/playlist-form.jsx'

import mockLocalStorage from '../mocks/local-storage'
import waitForRequests from '../helpers/wait-for-requests'

import AddTracksToPlaylistResponse from '../fixtures/spotify/add-tracks-to-playlist'
import CreatePlaylistResponse from '../fixtures/spotify/create-playlist'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'
import UnauthorizedResponse from '../fixtures/spotify/unauthorized'

const seedTrack = TrackSearchResponse.tracks.items[0]
const seed = {
  id: seedTrack.id,
  name: seedTrack.name,
  artists: seedTrack.artists.map(artist => artist.name),
  album: seedTrack.album.name,
  url: seedTrack.external_urls.spotify,
  albumUrl: seedTrack.album.external_urls.spotify,
  spotifyUri: seedTrack.uri,
  image: seedTrack.album.images[2].url
}

const recTrack = RecommendationsResponse.tracks[0]
const recommendation = {
  id: recTrack.id,
  name: recTrack.name,
  artists: recTrack.artists.map(artist => artist.name),
  album: recTrack.album.name,
  url: recTrack.external_urls.spotify,
  albumUrl: recTrack.album.external_urls.spotify,
  spotifyUri: recTrack.uri,
  image: recTrack.album.images[2].url
}

function props(opts) {
  return {
    recommendations: [recommendation],
    token: '123abc',
    onPlaylistCreated: opts.onPlaylistCreated,
    seed,
    unauthorized: opts.unauthorized,
    seedType: 'track'
  }
}

const userID = 'cheshire137'
const initialLocalData = { 'spotify-user-id': userID }

describe('PlaylistForm', () => {
  let component = null
  let wasUnauthorized = false
  let wasPlaylistCreated = false
  let store = null

  const unauthorized = () => {
    wasUnauthorized = true
  }

  const onPlaylistCreated = () => {
    wasPlaylistCreated = true
  }

  beforeEach(() => {
    store = { 'spotty-features': JSON.stringify(initialLocalData) }
    mockLocalStorage(store)

    const opts = { unauthorized, onPlaylistCreated }
    component = <PlaylistForm {...props(opts)} />
  })

  afterEach(fetchMock.restore)

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('creates playlist on submit', done => {
    const path1 = `users/${userID}/playlists`
    const createReq = fetchMock.post(`${Config.spotify.apiUrl}/${path1}`,
                                     CreatePlaylistResponse)

    const path2 = `users/${userID}/playlists/${CreatePlaylistResponse.id}/tracks`
    const addTrackReq = fetchMock.post(`${Config.spotify.apiUrl}/${path2}`,
                                       AddTracksToPlaylistResponse)

    expect(wasPlaylistCreated).toBe(false)

    const form = shallow(component).find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([createReq, addTrackReq], done, done.fail, () => {
      expect(wasPlaylistCreated).toBe(true)
    })
  })

  test('handles expired token', done => {
    const path = `users/${userID}/playlists`
    const resp = {
      body: UnauthorizedResponse,
      status: 401
    }
    const createReq = fetchMock.post(`${Config.spotify.apiUrl}/${path}`, resp)

    expect(wasUnauthorized).toBe(false)
    console.error = () => {}

    const form = shallow(component).find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([createReq], done, done.fail, () => {
      expect(wasUnauthorized).toBe(true)
    })
  })

  test('displays error with creating playlist', done => {
    const path = `users/${userID}/playlists`
    const resp = {
      body: { error: { status: 400, message: 'o crappa' } },
      status: 400
    }
    const createReq = fetchMock.post(`${Config.spotify.apiUrl}/${path}`, resp)

    console.error = () => {}

    const wrapper = shallow(component)

    expect(wrapper.find('.is-danger').length).toBe(0)

    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([createReq], done, done.fail, () => {
      const error = wrapper.find('.is-danger')
      expect(error.length).toBe(1)
      expect(error.text()).toBe('Could not create playlist: Error: Bad Request')
    })
  })
})
