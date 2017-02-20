import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import SeedTypeControls from '../../src/components/seed-type-controls.jsx'

describe('SeedTypeControls', () => {
  let component = null
  let seedType = 'track'

  const onSeedTypeChange = newType => {
    seedType = newType
  }

  beforeEach(() => {
    component = (
      <SeedTypeControls
        onSeedTypeChange={onSeedTypeChange}
        seedType={seedType}
      />
    )
  })

  afterEach(() => {
    seedType = 'track'
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('reports when seed type changes', () => {
    const wrapper = shallow(component)
    const trackRadio = wrapper.find('input[value="track"]')
    expect(trackRadio.props().checked).toBe(true)

    const artistRadio = wrapper.find('input[value="artist"]')
    artistRadio.simulate('change', { target: { value: 'artist' } })

    expect(seedType).toBe('artist')
  })
})
