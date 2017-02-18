import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import renderer from 'react-test-renderer'

import AudioFeaturesResponse from '../fixtures/spotify/audio-features'
import SavedTracksResponse from '../fixtures/spotify/saved-tracks'

import TrackListItem from '../../src/components/track-list-item.jsx'

describe('TrackListItem', () => {
  test('matches snapshot', () => {
    const track = SavedTracksResponse.items[0].track
    const component = renderer.create(
      <TrackListItem
        image={track.album.images[2].url}
        name={track.name}
        url={track.external_urls.spotify}
        artists={track.artists.map(a => a.name)}
        album={track.album.name}
        albumUrl={track.album.external_urls.spotify}
        audioFeatures={AudioFeaturesResponse}
        savedAt={new Date(SavedTracksResponse.items[0].added_at)}
        avgLoudness={AudioFeaturesResponse.loudness}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
