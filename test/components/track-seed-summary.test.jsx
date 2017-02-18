import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import TrackSearchResponse from '../fixtures/spotify/track-search'

import TrackSeedSummary from '../../src/components/track-seed-summary.jsx'

const track = TrackSearchResponse.tracks.items[0]

function props() {
  return {
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    image: track.album.images[2].url,
    name: track.name
  }
}

describe('TrackSeedSummary', () => {
  let component = null

  beforeEach(() => {
    component = <TrackSeedSummary {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
