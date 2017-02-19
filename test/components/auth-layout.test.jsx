import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Config from '../../src/public/config'
import AuthLayout from '../../src/components/auth-layout.jsx'

import mockLocalStorage from '../mocks/local-storage'
import waitForRequests from '../helpers/wait-for-requests'

import MeResponse from '../fixtures/spotify/me'

const initialLocalData = { 'spotify-token': '123abc' }

describe('AuthLayout', () => {
  let component = null
  let path = null
  let meRequest = null
  let store = null

  const routeChange = newPath => {
    path = newPath
  }

  beforeEach(() => {
    meRequest = fetchMock.get(`${Config.spotify.apiUrl}/me`, MeResponse)

    store = { 'spotty-features': JSON.stringify(initialLocalData) }
    mockLocalStorage(store)

    component = (
      <AuthLayout router={{ push: routeChange }}><p>hey</p></AuthLayout>
    )
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders details from Spotify', done => {
    waitForRequests([meRequest]).then(() => {
      try {
        const wrapper = shallow(component)

        // Ensure Spotify user is shown
        const user = wrapper.find('.username')
        expect(user.text()).toBe(MeResponse.display_name)

        // Page title
        const title = wrapper.find('.is-brand')
        expect(title.text()).toBe('Spotty Features')

        // Ensure data saved to local storage
        const expected = {
          'spotify-token': '123abc',
          'spotify-user-id': MeResponse.id,
          'spotify-user': MeResponse.display_name,
          'spotify-avatar-url': MeResponse.images[0].url
        }
        expect(store['spotty-features']).
          toEqual(JSON.stringify(expected))

        // Ensure given child content is rendered
        const content = wrapper.find('.content-container')
        expect(content.children().length).toBe(1)
        expect(content.children().text()).toBe('hey')

        // Log out
        expect(path).toBe(null)
        const link = wrapper.find('.logout-link')
        link.simulate('click', { preventDefault() {} })
        expect(path).toBe('/')
        expect(store['spotty-features']).
          toEqual(JSON.stringify({ 'spotify-user-id': MeResponse.id }))

        done()
      } catch (error) {
        done.fail(error)
      }
    })
  })
})
