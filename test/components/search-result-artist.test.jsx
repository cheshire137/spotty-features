import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import ArtistSearchResponse from '../fixtures/spotify/artist-search'

import SearchResultArtist from '../../src/components/search-result-artist.jsx'

const artist = ArtistSearchResponse.artists.items[0]
const image = artist.images[3].url

function props(chooseArtist, select) {
  return {
    image,
    name: artist.name,
    selected: false,
    chooseArtist,
    select
  }
}

describe('SearchResultArtist', () => {
  let component = null
  let artistChosen = false
  let artistSelected = false

  beforeEach(() => {
    const chooseArtist = () => {
      artistChosen = true
    }
    const select = () => {
      artistSelected = true
    }
    component = <SearchResultArtist {...props(chooseArtist, select)} />
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

  test('search result can be chosen', () => {
    const button = shallow(component).find('.search-result-button')
    expect(artistChosen).toBe(false)
    button.simulate('click')
    expect(artistChosen).toBe(true)
  })

  test('search result can be selected', () => {
    const button = shallow(component).find('li')
    expect(artistSelected).toBe(false)
    button.simulate('mouseover')
    expect(artistSelected).toBe(true)
  })
})
