import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import FeatureGuide from '../../src/components/feature-guide.jsx'

describe('FeatureGuide', () => {
  test('matches snapshot', () => {
    const component = <FeatureGuide activeView="trends" />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('changes class based on active view', () => {
    let component = <FeatureGuide activeView="search" />
    expect(shallow(component).find('.title.search-view').length).toBe(1)

    component = <FeatureGuide activeView="trends" />
    expect(shallow(component).find('.title.search-view').length).toBe(0)
  })
})
