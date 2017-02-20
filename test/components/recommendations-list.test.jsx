import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import RecommendationsList from '../../src/components/recommendations-list.jsx'

import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'

const recTrack = RecommendationsResponse.tracks[0]

const track = TrackSearchResponse.tracks.items[0]
const trackSeed = {
  id: track.id,
  name: track.name,
  url: track.external_urls.spotify,
  artists: track.artists.map(artist => artist.name),
  album: track.album.name,
  image: track.album.images[2].url,
  albumUrl: track.album.external_urls.spotify
}

const recommendation = {
  album: recTrack.album.name,
  albumUrl: recTrack.album.external_urls.spotify,
  artists: recTrack.artists.map(a => a.name),
  id: recTrack.id,
  image: recTrack.album.images[2].url,
  name: recTrack.name,
  spotifyUri: recTrack.uri,
  url: recTrack.external_urls.spotify
}

function props(opts) {
  return {
    unauthorized: () => {},
    changeAudioFeatures: opts.changeAudioFeatures,
    recommendations: opts.recommendations,
    token: '123abc',
    seedType: 'track',
    seed: trackSeed
  }
}

describe('RecommendationsList', () => {
  let wantToChangeAudioFeatures = false

  const changeAudioFeatures = () => {
    wantToChangeAudioFeatures = true
  }

  function getComponent(overrides) {
    const opts = Object.assign({
      changeAudioFeatures,
      recommendations: [recommendation]
    }, overrides || {})
    return <RecommendationsList {...props(opts)} />
  }

  afterEach(() => {
    wantToChangeAudioFeatures = false
  })

  test('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can go back to change audio features', () => {
    const button = shallow(getComponent()).find('.button.is-link')
    button.simulate('click')
    expect(wantToChangeAudioFeatures).toBe(true)
  })

  test('does not show playlist form when playlist is built', () => {
    const instance = shallow(getComponent()).instance()
    instance.onPlaylistCreated({
      name: 'whee',
      external_urls: { spotify: '' }
    })
    expect(instance.playlistForm()).toBeUndefined()
  })

  test('shows how many recommendations were found', () => {
    const title = shallow(getComponent()).find('.song-recs-title')
    expect(title.text()).toBe('Step 3: Save playlist (1 song)')
  })

  test('pluralizes song count appropriately', () => {
    const component = getComponent({
      recommendations: [recommendation, recommendation]
    })
    const instance = shallow(component).instance()
    expect(instance.trackCount()).toBe('2 songs')
  })
})
