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

const artist = ArtistSearchResponse.artists.items[0]
const artistSeed = {
  id: artist.id,
  name: artist.name,
  url: artist.external_urls.spotify,
  image: artist.images[3].url
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
    features: {
      danceability: 0.468,
      energy: 0.515,
      speechiness: 0.0665,
      acousticness: 0.145,
      instrumentalness: 0,
      liveness: 0.132,
      valence: 0.186
    }
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

  afterEach(() => {
    wasSeedChanged = false
    numRecommendations = null
    recommendations = null
  })

  test('matches snapshot for track seed', () => {
    const opts = Object.assign(baseOpts, {
      seed: trackSeed, seedType: 'track'
    })
    const component = <RecommendationsForm {...props(opts)} />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
