import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import renderer from 'react-test-renderer'

import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'

import TrackListItem from '../../src/components/track-list-item.jsx'

function props() {
  const track = SavedTracksResponse.items[0].track
  return {
    image: track.album.images[2].url,
    name: track.name,
    url: track.external_urls.spotify,
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    albumUrl: track.album.external_urls.spotify,
    audioFeatures: AudioFeaturesResponse,
    savedAt: new Date(SavedTracksResponse.items[0].added_at),
    avgLoudness: AudioFeaturesResponse.loudness
  }
}

describe('TrackListItem', () => {
  test('matches snapshot', () => {
    const component = renderer.create(
      <TrackListItem {...props()} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
