import React from 'react'
import { debounce } from 'throttle-debounce'

import SpotifyApi from '../models/spotify-api.js'

import SearchResultArtist from './search-result-artist.jsx'
import SearchResultTrack from './search-result-track.jsx'

class RecommendationsSeedSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = { results: [] }
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

  searchResult(result) {
    if (this.props.seedType === 'track') {
      return (
        <SearchResultTrack
          key={result.id}
          {...result}
          chooseTrack={() => this.props.chooseSeed(result)}
        />
      )
    }
    return (
      <SearchResultArtist
        key={result.id}
        {...result}
        chooseArtist={() => this.props.chooseSeed(result)}
      />
    )
  }

  onSeedQueryChange(event) {
    this.props.onSeedQueryChange(event)
    this.delayedSeedSearch()
  }

  seedTypeControls() {
    const { seedType, onSeedTypeChange } = this.props
    return (
      <div className="control">
        <label className="radio">
          <input
            type="radio"
            name="seed-type"
            checked={seedType === 'track'}
            value="track"
            onChange={e => onSeedTypeChange(e)}
          />
          Songs
        </label>
        <label className="radio">
          <input
            type="radio"
            name="seed-type"
            checked={seedType === 'artist'}
            value="artist"
            onChange={e => onSeedTypeChange(e)}
          />
          Artists
        </label>
      </div>
    )
  }

  render() {
    const { seedType, seedQuery } = this.props
    const { results } = this.state
    return (
      <form onSubmit={e => this.onSeedSearch(e)}>
        <h4 className="title is-4">Step 1: Seed your playlist</h4>
        <div className="control">
          <label className="label" htmlFor="seed">
            Find songs like:
          </label>
          <div className="results-container">
            <input
              type="text"
              id="seed"
              className="input"
              autoComplete="off"
              autoFocus
              value={seedQuery}
              onChange={e => this.onSeedQueryChange(e)}
              placeholder={this.placeholder()}
            />
            <ul className="results" style={{display: results.length < 1 ? 'none' : 'block'}}>
              {results.map(result => this.searchResult(result))}
            </ul>
          </div>
        </div>
        {this.seedTypeControls()}
      </form>
    )
  }
}

RecommendationsSeedSearch.propTypes = {
  onSeedTypeChange: React.PropTypes.func.isRequired,
  unauthorized: React.PropTypes.func.isRequired,
  seedType: React.PropTypes.string.isRequired,
  seedQuery: React.PropTypes.string.isRequired,
  chooseSeed: React.PropTypes.func.isRequired,
  onSeedQueryChange: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired
}

export default RecommendationsSeedSearch
