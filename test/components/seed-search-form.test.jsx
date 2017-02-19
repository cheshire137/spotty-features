import fetchMock from 'fetch-mock'
import React from 'react'
import renderer from 'react-test-renderer'

import SeedSearchForm from '../../src/components/seed-search-form.jsx'

function props(opts) {
  return {
    seedType: opts.seedType,
    seedQuery: 'scream grimes',
    token: '123abc',
    onSeedTypeChange: opts.onSeedTypeChange,
    unauthorized: opts.unauthorized,
    chooseSeed: opts.chooseSeed,
    onSeedQueryChange: opts.onSeedQueryChange
  }
}

describe('SeedSearchForm', () => {
  let component = null
  let seedType = 'track'
  let didSeedQueryChange = false
  let wasUnauthorized = false
  let seed = null

  const onSeedTypeChange = newSeedType => {
    seedType = newSeedType
  }

  const onSeedQueryChange = () => {
    didSeedQueryChange = true
  }

  const unauthorized = () => {
    wasUnauthorized = true
  }

  const chooseSeed = newSeed => {
    seed = newSeed
  }

  beforeEach(() => {
    const opts = {
      seedType, onSeedTypeChange, onSeedQueryChange, unauthorized,
      chooseSeed
    }
    component = <SeedSearchForm {...props(opts)} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
