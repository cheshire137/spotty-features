import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import TrackSearchResponse from '../fixtures/spotify/track-search'

import waitForRequests from '../helpers/wait-for-requests'

import Config from '../../src/public/config'
import SeedSearchForm from '../../src/components/seed-search-form.jsx'

function props(opts) {
  return {
    seedType: opts.seedType,
    seedQuery: 'scream grimes',
    token: '123abc',
    onSeedTypeChange: opts.onSeedTypeChange,
    unauthorized: opts.unauthorized,
    chooseSeed: opts.chooseSeed,
    onSeedQueryChange: opts.onSeedQueryChange
  }
}

describe('SeedSearchForm', () => {
  let component = null
  let seedType = 'track'
  let didSeedQueryChange = false
  let wasUnauthorized = false
  let seed = null

  const onSeedTypeChange = newSeedType => {
    seedType = newSeedType
  }

  const onSeedQueryChange = () => {
    didSeedQueryChange = true
  }

  const unauthorized = () => {
    wasUnauthorized = true
  }

  const chooseSeed = newSeed => {
    seed = newSeed
  }

  beforeEach(() => {
    const opts = {
      seedType, onSeedTypeChange, onSeedQueryChange, unauthorized,
      chooseSeed
    }
    component = <SeedSearchForm {...props(opts)} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can search via form', done => {
    const path = 'search?q=scream%20grimes&type=track&limit=20&offset=0'
    const searchReq = fetchMock.get(`${Config.spotify.apiUrl}/${path}`,
                                    TrackSearchResponse)

    const wrapper = shallow(component)
    expect(wrapper.find('.results').children().length).toBe(0)

    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault() {} })

    waitForRequests([searchReq], done, () => {
      expect(wrapper.find('.results').children().length).toBe(1)
    })
  })
})
