import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Config from '../../src/public/config'
import Search from '../../src/components/search.jsx'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'
import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import RecommendationsResponse from '../fixtures/spotify/recommendations'
import TrackSearchResponse from '../fixtures/spotify/track-search'
import UnauthorizedResponse from '../fixtures/spotify/unauthorized'

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
  let artistSearchReq = null
  let trackSearchReq = null
  let recommendationsReq = null
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
    const path1 = 'search?q=tom%20petty&type=artist&limit=20&offset=0'
    artistSearchReq = fetchMock.get(`${Config.spotify.apiUrl}/${path1}`,
                                    ArtistSearchResponse)

    const path2 = 'search?q=scream%20grimes&type=track&limit=20&offset=0'
    trackSearchReq = fetchMock.get(`${Config.spotify.apiUrl}/${path2}`,
                                   TrackSearchResponse)

    const path3 = 'recommendations?limit=25&seed_tracks=6cgvDYk7YGQTVfd5jsw0Qw' +
      '&target_acousticness=0.145&target_danceability=0.468&target_energy=0.515' +
      '&target_instrumentalness=0.5&target_liveness=0.132&target_valence=0.186' +
      '&target_speechiness=0.0665'
    recommendationsReq = fetchMock.get(`${Config.spotify.apiUrl}/${path3}`, RecommendationsResponse)

    const opts = {
      unauthorized, recommendationsFormShown, recommendationsFormHidden
    }
    component = <Search {...props(opts)} />
  })

  afterEach(fetchMock.restore)

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can search for artists and choose one as a seed', done => {
    const wrapper = mount(component)

    // No search results, chosen seed artist, or audio features header yet
    expect(wrapper.find('.results').children().length).toBe(0)
    expect(wrapper.find('.seed-summary').length).toBe(0)
    expect(wrapper.find('.refine-title').length).toBe(0)

    // Choose artist search
    const radio = wrapper.find('input[name="seed-type"][value="artist"]')
    radio.simulate('change', { target: { value: 'artist' } })

    // Enter an artist search query
    const input = wrapper.find('#seed')
    input.simulate('change', { target: { value: 'tom petty' } })

    // Submit the search form
    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([artistSearchReq], done, done.fail, () => {
      // Still no audio features header
      expect(wrapper.find('.refine-title').length).toBe(0)

      // Should see artist search result
      const children = wrapper.find('.results').children()
      expect(children.length).toBe(1)
      expect(children.at(0).name()).toBe('SearchResultArtist')

      // Choose the search result as our seed artist
      const button = wrapper.find('.results .search-result-button')
      expect(button.length).toBe(1)
      button.simulate('click')

      // Now should see the artist seed summary, audio features header, and
      // audio feature sliders
      expect(wrapper.find('.seed-summary').length).toBe(1)
      expect(wrapper.find('.refine-title').length).toBe(1)
      expect(wasRecommendationsFormShown).toBe(true)
    })
  })

  test('can search for tracks, choose one as a seed, and get recs', done => {
    const trackID = '6cgvDYk7YGQTVfd5jsw0Qw'
    const path2 = `audio-features/${trackID}`
    const featureReq = fetchMock.get(`${Config.spotify.apiUrl}/${path2}`,
                                     AudioFeaturesResponse)

    const wrapper = mount(component)

    // No search results, chosen seed track, audio features header,
    // or recommendations yet
    expect(wrapper.find('.results').children().length).toBe(0)
    expect(wrapper.find('.seed-summary').length).toBe(0)
    expect(wrapper.find('.refine-title').length).toBe(0)
    expect(wrapper.find('.recommendations-list').length).toBe(0)

    // Enter a track search query
    const input = wrapper.find('#seed')
    input.simulate('change', { target: { value: 'scream grimes' } })

    // Submit the search form
    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([trackSearchReq], null, done.fail, () => {
      // Still no audio features header or recommendations list
      expect(wrapper.find('.refine-title').length).toBe(0)
      expect(wrapper.find('.recommendations-list').length).toBe(0)

      // Should see track search result
      const children = wrapper.find('.results').children()
      expect(children.length).toBe(1)
      expect(children.at(0).name()).toBe('SearchResultTrack')

      // Choose the search result as our seed track
      const button = wrapper.find('.results .search-result-button')
      expect(button.length).toBe(1)
      button.simulate('click')

      waitForRequests([featureReq], null, done.fail, () => {
        // Now should see the track seed summary, audio features header,
        // and recommendations form audio feature sliders
        expect(wrapper.find('.seed-summary').length).toBe(1)
        expect(wrapper.find('.refine-title').length).toBe(1)
        expect(wasRecommendationsFormShown).toBe(true)

        // Still no recommendations list
        expect(wrapper.find('.recommendations-list').length).toBe(0)

        // Find audio features form and submit it to get recommendations
        const recForm = wrapper.find('.content form')
        recForm.simulate('submit', { preventDefault() {} })

        waitForRequests([recommendationsReq], done, done.fail, () => {
          // Now we should have a list of recommendations for our playlist
          expect(wrapper.find('.recommendations-list').length).toBe(1)
        })
      })
    })
  })

  test('handles expired token on audio features search', done => {
    const trackID = '6cgvDYk7YGQTVfd5jsw0Qw'
    const path2 = `audio-features/${trackID}`
    const resp = {
      body: UnauthorizedResponse,
      status: 401
    }
    const featureReq = fetchMock.get(`${Config.spotify.apiUrl}/${path2}`,
                                     resp)

    const wrapper = mount(component)

    expect(wasUnauthorized).toBe(false)
    console.error = () => {}

    // Enter a track search query
    const input = wrapper.find('#seed')
    input.simulate('change', { target: { value: 'scream grimes' } })

    // Submit the search form
    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([trackSearchReq], null, done.fail, () => {
      // Choose the search result as our seed track
      const button = wrapper.find('.results .search-result-button')
      expect(button.length).toBe(1)
      button.simulate('click')

      waitForRequests([featureReq], done, done.fail, () => {
        expect(wasUnauthorized).toBe(true)
      })
    })
  })
})
