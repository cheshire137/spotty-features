import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import RecommendationsList from '../../src/components/recommendations-list.jsx'

import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'

const recommendation = RecommendationsResponse.tracks[0]

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

function props(opts) {
  return {
    unauthorized: () => {},
    changeAudioFeatures: opts.changeAudioFeatures,
    recommendations: [
      {
        album: recommendation.album.name,
        albumUrl: recommendation.album.external_urls.spotify,
        artists: recommendation.artists.map(a => a.name),
        id: recommendation.id,
        image: recommendation.album.images[2].url,
        name: recommendation.name,
        spotifyUri: recommendation.uri,
        url: recommendation.external_urls.spotify
      }
    ],
    token: '123abc',
    seedType: 'track',
    seed: trackSeed
  }
}

describe('RecommendationsList', () => {
  let component = null
  let wantToChangeAudioFeatures = false

  const changeAudioFeatures = () => {
    wantToChangeAudioFeatures = true
  }

  beforeEach(() => {
    const opts = { changeAudioFeatures }
    component = <RecommendationsList {...props(opts)} />
  })

  afterEach(() => {
    wantToChangeAudioFeatures = false
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can go back to change audio features', () => {
    const button = shallow(component).find('.button.is-link')
    button.simulate('click')
    expect(wantToChangeAudioFeatures).toBe(true)
  })
})
