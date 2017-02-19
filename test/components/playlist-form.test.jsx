import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import PlaylistForm from '../../src/components/playlist-form.jsx'

import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'

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

describe('PlaylistForm', () => {
  let component = null
  let wasUnauthorized = false
  let wasPlaylistCreated = false

  const unauthorized = () => {
    wasUnauthorized = true
  }

  const onPlaylistCreated = () => {
    wasPlaylistCreated = true
  }

  beforeEach(() => {
    const opts = { unauthorized, onPlaylistCreated }
    component = <PlaylistForm {...props(opts)} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
