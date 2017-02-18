import React from 'react'
import renderer from 'react-test-renderer'

import getDOM from '../helpers/get-dom'

import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'

import TrackListItem from '../../src/components/track-list-item.jsx'

function props() {
  const item = SavedTracksResponse.items[0]
  const track = item.track
  return {
    image: track.album.images[2].url,
    name: track.name,
    url: track.external_urls.spotify,
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    albumUrl: track.album.external_urls.spotify,
    audioFeatures: AudioFeaturesResponse,
    savedAt: new Date(item.added_at),
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

  test('lists artists', () => {
    const dom = getDOM(<TrackListItem {...props()} />)
    const artists = dom.querySelector('.track-artists')
    expect(artists.textContent).toBe('Nick Jonas, Nicki Minaj')
  })
})
