import React from 'react'
import renderer from 'react-test-renderer'

import FeatureGuide from '../../src/components/feature-guide.jsx'

describe('FeatureGuide', () => {
  let component = null

  beforeEach(() => {
    component = <FeatureGuide activeView="trends" />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
