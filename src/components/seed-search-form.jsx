import React from 'react'
import { debounce } from 'throttle-debounce'

import SpotifyApi from '../models/spotify-api'

import SearchResultArtist from './search-result-artist.jsx'
import SearchResultTrack from './search-result-track.jsx'
import SeedTypeControls from './seed-type-controls.jsx'

class SeedSearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      selectedResultIndex: -1
    }
    this.delayedSeedSearch = debounce(500, this.delayedSeedSearch)
  }

  delayedSeedSearch() {
    this.onSeedSearch()
  }

  onSeedSearch(event) {
    if (event) {
      event.preventDefault()
    }
    const { seedType, seedQuery, token } = this.props
    if (!seedQuery || seedQuery.length < 1) {
      this.setState({ results: [] })
      return
    }
    const opts = { q: seedQuery, type: seedType }
    const api = new SpotifyApi(token)
    api.search(opts).then(json => this.onSeedSearchResults(json)).
      catch(err => this.onSeedSearchError(err))
  }

  onSeedSearchResults(json) {
    const { seedType } = this.props
    const key = `${seedType}s`
    const results = []
    for (const item of json[key].items) {
      const result = {
        id: item.id,
        name: item.name,
        url: item.external_urls.spotify
      }
      if (seedType === 'track') {
        result.artists = item.artists.map(artist => artist.name)
        result.album = item.album.name
        const images = item.album.images.filter(img => img.width < 100)
        if (images.length > 0) {
          result.image = images[0].url
        }
        result.albumUrl = item.album.external_urls.spotify
      } else {
        const images = item.images.filter(img => img.width < 100)
        if (images.length > 0) {
          result.image = images[0].url
        }
      }
      results.push(result)
      if (results.length > 4) {
        break
      }
    }
    this.setState({ results })
  }

  onSeedSearchError(error) {
    console.error(`failed to search ${this.props.seedType}s`, error)
    if (error.response.status === 401) {
      this.props.unauthorized()
    }
  }

  placeholder() {
    const noun = this.props.seedType === 'track' ? 'songs' : 'artists'
    return `Search ${noun} on Spotify`
  }

  selectResultIndex(index) {
    if (this.state.selectedResultIndex !== index) {
      this.setState({ selectedResultIndex: index })
    }
  }

  searchResult(result, index) {
    if (this.props.seedType === 'track') {
      return (
        <SearchResultTrack
          key={result.id}
          {...result}
          select={() => this.selectResultIndex(index)}
          selected={index === this.state.selectedResultIndex}
          chooseTrack={() => this.props.chooseSeed(result)}
        />
      )
    }
    return (
      <SearchResultArtist
        key={result.id}
        {...result}
        select={() => this.selectResultIndex(index)}
        selected={index === this.state.selectedResultIndex}
        chooseArtist={() => this.props.chooseSeed(result)}
      />
    )
  }

  onSeedQueryChange(event) {
    this.props.onSeedQueryChange(event)
    this.delayedSeedSearch()
  }

  selectSearchResult(event, offset) {
    const { results } = this.state
    if (results.length < 1) {
      return
    }
    event.preventDefault()
    let index = this.state.selectedResultIndex + offset
    if (index >= results.length) {
      index = 0
    }
    if (index < 0) {
      index = results.length - 1
    }
    this.setState({ selectedResultIndex: index })
  }

  chooseSelectedSearchResult(event) {
    const { selectedResultIndex, results } = this.state
    if (selectedResultIndex >= 0 && selectedResultIndex < results.length) {
      const result = results[selectedResultIndex]
      event.preventDefault()
      this.props.chooseSeed(result)
    } else {
      this.setState({ selectedResultIndex: -1 })
    }
  }

  onSeedQueryKeyUp(event) {
    switch (event.which) {
      case 13: // Enter
        this.chooseSelectedSearchResult(event)
        break
      case 40: // down
        this.selectSearchResult(event, 1)
        break
      case 38: // up
        this.selectSearchResult(event, -1)
        break
    }
  }

  onSeedTypeChange(seedType) {
    this.setState({ selectedResultIndex: -1 }, () => {
      this.props.onSeedTypeChange(seedType)
      this.seedQueryInput.focus()
    })
  }

  render() {
    const { seedType, seedQuery } = this.props
    const { results } = this.state
    const noun = seedType === 'track' ? 'song' : 'artist'
    return (
      <form onSubmit={e => this.onSeedSearch(e)}>
        <h3 className="title is-3">Step 1: Seed your playlist</h3>
        <div className="control">
          <label className="label" htmlFor="seed">
            Find songs based on this {noun}:
          </label>
          <div className="results-container">
            <input
              type="text"
              ref={input => { this.seedQueryInput = input }}
              id="seed"
              className="input is-large"
              autoComplete="off"
              autoFocus
              value={seedQuery}
              onChange={e => this.onSeedQueryChange(e)}
              onKeyUp={e => this.onSeedQueryKeyUp(e)}
              placeholder={this.placeholder()}
            />
            <ul className="results" style={{ display: results.length < 1 ? 'none' : 'block' }}>
              {results.map((result, i) => this.searchResult(result, i))}
            </ul>
          </div>
        </div>
        <SeedTypeControls
          seedType={seedType}
          onSeedTypeChange={val => this.onSeedTypeChange(val)}
        />
      </form>
    )
  }
}

SeedSearchForm.propTypes = {
  onSeedTypeChange: React.PropTypes.func.isRequired,
  unauthorized: React.PropTypes.func.isRequired,
  seedType: React.PropTypes.string.isRequired,
  seedQuery: React.PropTypes.string.isRequired,
  chooseSeed: React.PropTypes.func.isRequired,
  onSeedQueryChange: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired
}

export default SeedSearchForm
