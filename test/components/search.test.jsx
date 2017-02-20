import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Search from '../../src/components/search.jsx'

function props(unauthorized) {
  return {
    token: '123abc',
    unauthorized
  }
}

describe('Search', () => {
  let component = null
  let wasUnauthorized = false

  const unauthorized = () => {
    wasUnauthorized = true
  }

  beforeEach(() => {
    component = <Search {...props(unauthorized)} />
  })

  afterEach(fetchMock.restore)

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
