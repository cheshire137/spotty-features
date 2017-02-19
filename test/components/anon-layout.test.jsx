import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import AnonLayout from '../../src/components/anon-layout.jsx'

describe('AnonLayout', () => {
  let component = null

  beforeEach(() => {
    component = <AnonLayout children={<div>hey</div>} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('has title', () => {
    const title = shallow(component).find('.title a')
    expect(title.text()).toBe('Spotty Features')
  })

  test('includes children', () => {
    const content = shallow(component).find('.content-container')
    expect(content.children().length).toBe(1)
    expect(content.children().text()).toBe('hey')
  })
})
