import fetchMock from 'fetch-mock'
import MockDate from 'mockdate'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Config from '../../src/public/config'
import Spotify from '../../src/components/spotify.jsx'

import mockLocalStorage from '../mocks/local-storage'
import waitForRequests from '../helpers/wait-for-requests'

import MultiAudioFeaturesResponse from '../fixtures/spotify/multi-audio-features'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'

const initialLocalData = { 'spotify-token': '123abc' }

describe('Spotify', () => {
  let component = null
  // let path = null
  let store = null
  let tracksReq = null
  let featuresReq = null

  const routeChange = () => {
    // path = newPath
  }

  beforeEach(() => {
    MockDate.set('3/15/2017')

    store = { 'spotty-features': JSON.stringify(initialLocalData) }
    mockLocalStorage(store)

    const path1 = 'me/tracks?limit=50&offset=0'
    tracksReq = fetchMock.get(`${Config.spotify.apiUrl}/${path1}`,
                              SavedTracksResponse)

    const path2 = 'audio-features?ids=4nDfc6F2uVcc6wdG7kBzWO'
    featuresReq = fetchMock.get(`${Config.spotify.apiUrl}/${path2}`,
                                MultiAudioFeaturesResponse)

    component = <Spotify numWeeks={1} router={{ push: routeChange }} />
  })

  afterEach(fetchMock.restore)

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('shows recently saved tracks', done => {
    const wrapper = mount(component)
    expect(wrapper.find('.week-list-container').length).toBe(0)

    waitForRequests([tracksReq, featuresReq], done, () => {
      expect(wrapper.find('.week-list-container').length).toBe(1)
    })
  })
})
