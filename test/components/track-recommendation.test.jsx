import React from 'react'
import renderer from 'react-test-renderer'

import SavedTracksResponse from '../fixtures/spotify/saved-tracks'

import TrackRecommendation from '../../src/components/track-recommendation.jsx'

const item = SavedTracksResponse.items[0]
const track = item.track

function props() {
  return {
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    image: track.album.images[2].url,
    name: track.name,
    url: track.external_urls.spotify,
    albumUrl: track.album.external_urls.spotify
  }
}

describe('TrackRecommendation', () => {
  let component = null

  beforeEach(() => {
    component = <TrackRecommendation {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
