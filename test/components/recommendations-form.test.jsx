import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import RecommendationsForm from '../../src/components/recommendations-form.jsx'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'
import TrackSearchResponse from '../fixtures/spotify/track-search'

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
const trackFeatures = {
  danceability: 0.468,
  energy: 0.515,
  speechiness: 0.0665,
  acousticness: 0.145,
  instrumentalness: 0,
  liveness: 0.132,
  valence: 0.186
}

const artist = ArtistSearchResponse.artists.items[0]
const artistSeed = {
  id: artist.id,
  name: artist.name,
  url: artist.external_urls.spotify,
  image: artist.images[3].url
}
const artistFeatures = {
  danceability: 0.5,
  energy: 0.5,
  speechiness: 0,
  acousticness: 0.5,
  instrumentalness: 0.5,
  liveness: 0,
  valence: 0.5
}

function props(opts) {
  return {
    changeSeed: opts.changeSeed,
    numRecommendations: 25,
    seed: opts.seed,
    seedType: opts.seedType,
    token: '123abc',
    onNumRecommendationsChange: opts.onNumRecommendationsChange,
    onRecommendations: opts.onRecommendations,
    features: opts.features
  }
}

describe('RecommendationsForm', () => {
  let wasSeedChanged = false
  let numRecommendations = null
  let recommendations = null

  const changeSeed = () => {
    wasSeedChanged = true
  }

  const onNumRecommendationsChange = newNum => {
    numRecommendations = newNum
  }

  const onRecommendations = newRecs => {
    recommendations = newRecs
  }

  const baseOpts = {
    changeSeed, onNumRecommendationsChange, onRecommendations
  }

  function getTrackComponent() {
    const opts = Object.assign(baseOpts, {
      seed: trackSeed, seedType: 'track', features: trackFeatures
    })
    return <RecommendationsForm {...props(opts)} />
  }

  function getArtistComponent() {
    const opts = Object.assign(baseOpts, {
      seed: artistSeed, seedType: 'artist', features: artistFeatures
    })
    return <RecommendationsForm {...props(opts)} />
  }

  afterEach(() => {
    wasSeedChanged = false
    numRecommendations = null
    recommendations = null
  })

  test('matches snapshot for track seed', () => {
    const component = getTrackComponent()
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('matches snapshot for artist seed', () => {
    const component = getArtistComponent()
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can change how many recommendations to get', () => {
    const component = getTrackComponent()
    const select = shallow(component).find('#num-recommendations')
    select.simulate('change', { target: { value: 50 } })
    expect(numRecommendations).toBe(50)
  })

  test('can change feature slider', () => {
    const wrapper = shallow(getArtistComponent())
    const slider = wrapper.find('#liveness')
    slider.simulate('change', { target: { value: 0.3 } })
    expect(wrapper.find('#liveness').props().value).toBeCloseTo(0.3, 5)
  })
})
