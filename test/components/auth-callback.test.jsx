import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import AuthCallback from '../../src/components/auth-callback.jsx'

import mockLocalStorage from '../mocks/local-storage'

describe('AuthCallback', () => {
  let component = null
  let path = null
  let store = null
  const accessToken = '123abc'

  const routeChange = newPath => {
    path = newPath
  }

  beforeEach(() => {
    store = { 'spotty-features': JSON.stringify({}) }
    mockLocalStorage(store)

    const router = {
      location: {
        hash: `#access_token=${accessToken}&token_type=Bearer&expires_in=3600`,
        path: '/auth'
      },
      push: routeChange,
      replace: () => {},
      go: () => {},
      goBack: () => {},
      goForward: () => {},
      setRouteLeaveHook: () => {},
      isActive: () => {}
    }

    component = <AuthCallback router={router} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('saves token and redirects', () => {
    mount(component)
    expect(path).toBe('/spotify')
    expect(store).toEqual({
      'spotty-features': `{"spotify-token":"${accessToken}"}`
    })
  })
})
