import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

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
  let component = null

  beforeEach(() => {
    component = <TrackListItem {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('lists artists', () => {
    const artists = shallow(component).find('.track-artists')
    expect(artists.text()).toBe('Nick Jonas, Nicki Minaj')
  })

  test('displays song title', () => {
    const title = shallow(component).find('.track-name')
    expect(title.text()).toBe('Bom Bidi Bom')
  })

  test('displays album name', () => {
    const album = shallow(component).find('.track-album')
    expect(album.text()).toBe('Fifty Shades Darker (Original Motion Picture Soundtrack)')
  })
})
