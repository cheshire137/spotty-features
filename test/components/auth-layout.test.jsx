import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import AuthLayout from '../../src/components/auth-layout.jsx'

import mockLocalStorage from '../mocks/local-storage'
import waitForRequests from '../helpers/wait-for-requests'

import MeResponse from '../fixtures/spotify/me'

function props(push) {
  return {
    children: <div>hey</div>,
    router: {push}
  }
}

const initialLocalData = { 'spotify-token': '123abc' }

describe('AuthLayout', () => {
  let component = null
  let path = null
  let meRequest = null
  let store = null

  beforeEach(() => {
    meRequest = fetchMock.get(`${Config.spotify.apiUrl}/me`, MeResponse)

    store = { 'spotty-features': JSON.stringify(initialLocalData) }
    mockLocalStorage(store)

    const routeChange = newPath => {
      path = newPath
    }
    component = <AuthLayout {...props(routeChange)} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('has title', () => {
    const title = shallow(component).find('.is-brand')
    expect(title.text()).toBe('Spotty Features')
  })

  test('loads user details', done => {
    waitForRequests([meRequest]).then(() => {
      const wrapper = shallow(component)

      const user = wrapper.find('.username')
      expect(user.text()).toBe(MeResponse.display_name)

      const expected = initialLocalData
      expected['spotify-user-id'] = MeResponse.id
      expected['spotify-user'] = MeResponse.display_name
      expected['spotify-avatar-url'] = MeResponse.images[0].url
      expect(store['spotty-features']).toEqual(JSON.stringify(expected))

      done()
    })
  })
})
