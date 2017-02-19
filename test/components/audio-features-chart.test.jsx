import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import AudioFeaturesChart from '../../src/components/audio-features-chart.jsx'

const weeklyAverages = {
  acousticness: { '2017-02-18T04:50:15Z': 0.145 },
  danceability: { '2017-02-18T04:50:15Z': 0.468 },
  energy: { '2017-02-18T04:50:15Z': 0.515 },
  valence: { '2017-02-18T04:50:15Z': 0.186 },
  instrumentalness: { '2017-02-18T04:50:15Z': 0 },
  liveness: { '2017-02-18T04:50:15Z': 0.132 },
  speechiness: { '2017-02-18T04:50:15Z': 0.0665 },
  negativity: { '2017-02-18T04:50:15Z': 0.814 }
}

function props(type) {
  return { weeklyAverages, type, width: 800 }
}

describe('AudioFeaturesChart', () => {
  test('matches snapshot for all-features chart', () => {
    const component = <AudioFeaturesChart {...props('all')} />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('matches snapshot for mood chart', () => {
    const component = <AudioFeaturesChart {...props('mood')} />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('matches snapshot for party chart', () => {
    const component = <AudioFeaturesChart {...props('party')} />
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
