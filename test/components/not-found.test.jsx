import React from 'react'
import TestUtils from 'react-addons-test-utils'
import renderer from 'react-test-renderer'

import NotFound from '../../src/components/not-found.jsx'

describe('NotFound', () => {
  test('matches snapshot', () => {
    const component = renderer.create(<NotFound />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<NotFound />)

    const result = renderer.getRenderOutput()
    expect(result.props.children).toBe('404 Not Found')
    expect(result.type).toBe('h1')
  })
})
