import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import TrackSearchResponse from '../fixtures/spotify/track-search'

import SearchResultTrack from '../../src/components/search-result-track.jsx'

const track = TrackSearchResponse.tracks.items[0]
const image = track.album.images[2].url

function props(chooseTrack, select) {
  return {
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    image,
    name: track.name,
    selected: false,
    chooseTrack,
    select
  }
}

describe('SearchResultTrack', () => {
  let component = null
  let trackChosen = false
  let trackSelected = false

  beforeEach(() => {
    const chooseTrack = () => {
      trackChosen = true
    }
    const select = () => {
      trackSelected = true
    }
    component = <SearchResultTrack {...props(chooseTrack, select)} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('lists artists', () => {
    const artists = shallow(component).find('.track-artists')
    expect(artists.text()).toBe('Grimes, Aristophanes')
  })

  test('displays song title', () => {
    const title = shallow(component).find('.track-name')
    expect(title.text()).toBe('SCREAM')
  })

  test('displays album name', () => {
    const album = shallow(component).find('.track-album')
    expect(album.text()).toBe('Art Angels')
  })

  test('displays album art', () => {
    const images = shallow(component).find('.track-image')
    expect(images.length).toBe(1)
    expect(images.at(0).props().src).toBe(image)
  })

  test('search result can be chosen', () => {
    const button = shallow(component).find('.search-result-button')
    expect(trackChosen).toBe(false)
    button.simulate('click')
    expect(trackChosen).toBe(true)
  })

  test('search result can be selected', () => {
    const button = shallow(component).find('li')
    expect(trackSelected).toBe(false)
    button.simulate('mouseover')
    expect(trackSelected).toBe(true)
  })
})
