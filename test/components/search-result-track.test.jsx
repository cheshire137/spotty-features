import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import TrackSearchResponse from '../fixtures/spotify/track-search'

import SearchResultTrack from '../../src/components/search-result-track.jsx'

const track = TrackSearchResponse.tracks.items[0]

function chooseTrack() {

}

function select() {

}

function props() {
  return {
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    image: track.album.images[2].url,
    name: track.name,
    selected: true,
    chooseTrack,
    select
  }
}

describe('SearchResultTrack', () => {
  let component = null

  beforeEach(() => {
    component = <SearchResultTrack {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
