import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import Search from '../../src/components/search.jsx'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'
import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import TrackSearchResponse from '../fixtures/spotify/track-search'

import waitForRequests from '../helpers/wait-for-requests'

function props(opts) {
  return {
    token: '123abc',
    unauthorized: opts.unauthorized,
    recommendationsFormShown: opts.recommendationsFormShown,
    recommendationsFormHidden: opts.recommendationsFormHidden
  }
}

describe('Search', () => {
  let component = null
  let wasUnauthorized = false
  let wasRecommendationsFormShown = null

  const unauthorized = () => {
    wasUnauthorized = true
  }

  const recommendationsFormShown = () => {
    wasRecommendationsFormShown = true
  }

  const recommendationsFormHidden = () => {
    wasRecommendationsFormShown = false
  }

  beforeEach(() => {
    const opts = {
      unauthorized, recommendationsFormShown, recommendationsFormHidden
    }
    component = <Search {...props(opts)} />
  })

  afterEach(() => {
    fetchMock.restore()
    wasRecommendationsFormShown = null
    wasUnauthorized = false
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders seed search form', () => {
    const container = shallow(component).find('div')
    expect(container.children().name()).toBe('SeedSearchForm')
  })

  test('handles expired token on audio features search', () => {
    console.error = () => {}
    expect(wasUnauthorized).toBe(false)

    const error = { response: { status: 401 } }
    shallow(component).instance().onAudioFeaturesError(error)

    expect(wasUnauthorized).toBe(true)
  })

  test('recommendations form shown when seed track chosen', done => {
    const track = TrackSearchResponse.tracks.items[0]
    const seed = {
      id: track.id,
      name: track.name,
      url: track.external_urls.spotify,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      image: track.album.images[2].url,
      albumUrl: track.album.external_urls.spotify
    }

    const path = `audio-features/${seed.id}`
    const featureReq = fetchMock.get(`${Config.spotify.apiUrl}/${path}`,
                                     AudioFeaturesResponse)

    shallow(component).instance().chooseSeed(seed)

    waitForRequests([featureReq], done, done.fail, () => {
      expect(wasRecommendationsFormShown).toBe(true)
    })
  })

  test('recommendations form shown when seed artist chosen', () => {
    const artist = ArtistSearchResponse.artists.items[0]
    const seed = {
      id: artist.id,
      name: artist.name,
      url: artist.external_urls.spotify,
      image: artist.images[3].url
    }

    const instance = shallow(component).instance()
    instance.onSeedTypeChange('artist')
    instance.chooseSeed(seed)
    expect(wasRecommendationsFormShown).toBe(true)
  })
})
