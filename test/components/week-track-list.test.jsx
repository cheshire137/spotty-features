import React from 'react'
import renderer from 'react-test-renderer'

import SavedTrackResponse from '../fixtures/spotify/saved-tracks'

import WeekTrackList from '../../src/components/week-track-list.jsx'

const weekStr = '2017-02-12T06:00:00.000Z'
const item = SavedTrackResponse.items[0]
const track = {
  id: item.track.id,
  savedAt: new Date(item.added_at),
  week: new Date(weekStr),
  name: item.track.name,
  artists: item.track.artists.map(artist => artist.name),
  album: item.track.album.name,
  url: item.track.external_urls.spotify,
  albumUrl: item.track.album.external_urls.spotify,
  audioFeatures: {
    acousticness: 0.145,
    danceability: 0.468,
    energy: 0.515,
    instrumentalness: 0,
    liveness: 0.132,
    loudness: -6.578,
    speechiness: 0.0665,
    valence: 0.186,
    negativity: 0.814
  }
}

function props() {
  return {
    week: weekStr,
    tracks: [track],
    avgLoudness: track.audioFeatures.loudness
  }
}

describe('WeekTrackList', () => {
  let component = null

  beforeEach(() => {
    component = <WeekTrackList {...props()} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
