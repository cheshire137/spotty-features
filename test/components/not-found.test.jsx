import React from 'react'
import renderer from 'react-test-renderer'

import NotFound from '../../src/components/not-found.jsx'

describe('NotFound', () => {
  test('matches snapshot', () => {
    const component = renderer.create(
      <NotFound />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
