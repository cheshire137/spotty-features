import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import RecommendationsForm from '../../src/components/recommendations-form.jsx'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'

import waitForRequests from '../helpers/wait-for-requests'

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

  test('can get recommendations by submitting form', done => {
    const path = `recommendations?limit=25&seed_tracks=${trackSeed.id}` +
      `&target_acousticness=${trackFeatures.acousticness}` +
      `&target_danceability=${trackFeatures.danceability}` +
      `&target_energy=${trackFeatures.energy}` +
      `&target_instrumentalness=${trackFeatures.instrumentalness}` +
      `&target_liveness=${trackFeatures.liveness}` +
      `&target_valence=${trackFeatures.valence}` +
      `&target_speechiness=${trackFeatures.speechiness}`
    const recReq = fetchMock.get(`${Config.spotify.apiUrl}/${path}`,
                                 RecommendationsResponse)

    const recommendation = RecommendationsResponse.tracks[0]
    const expectedRec = {
      album: recommendation.album.name,
      albumUrl: recommendation.album.external_urls.spotify,
      artists: recommendation.artists.map(a => a.name),
      id: recommendation.id,
      image: recommendation.album.images[2].url,
      name: recommendation.name,
      spotifyUri: recommendation.uri,
      url: recommendation.external_urls.spotify
    }

    const wrapper = shallow(getTrackComponent())
    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([recReq], done, done.fail, () => {
      expect(recommendations).toEqual([expectedRec])
    })
  })

  test('can go back to change seed for playlist', () => {
    const button = shallow(getArtistComponent()).find('.button.is-link')
    button.simulate('click')
    expect(wasSeedChanged).toBe(true)
  })
})
