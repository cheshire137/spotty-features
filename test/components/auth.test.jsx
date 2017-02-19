import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Auth from '../../src/components/auth.jsx'

describe('Auth', () => {
  test('matches snapshot', () => {
    const component = <Auth />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
