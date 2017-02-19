import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'

import ArtistSeedSummary from '../../src/components/artist-seed-summary.jsx'

const artist = ArtistSearchResponse.artists.items[0]
const image = artist.images[3].url

function props() {
  return { image, name: artist.name }
}

describe('ArtistSeedSummary', () => {
  let component = null

  beforeEach(() => {
    component = <ArtistSeedSummary {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('displays artist name', () => {
    const title = shallow(component).find('.track-name')
    expect(title.text()).toBe('Tom Petty')
  })

  test('displays artist art', () => {
    const images = shallow(component).find('.track-image')
    expect(images.length).toBe(1)
    expect(images.at(0).props().src).toBe(image)
  })
})
