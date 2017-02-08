import React from 'react'
import { debounce } from 'throttle-debounce'

import ArtistSeedSummary from './artist-seed-summary.jsx'
import SearchResultArtist from './search-result-artist.jsx'
import SearchResultTrack from './search-result-track.jsx'
import TrackSeedSummary from './track-seed-summary.jsx'

import Features from '../models/features.js'
import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = { seedType: 'track', results: [], seedQuery: '' }
    this.delayedSeedSearch = debounce(500, this.delayedSeedSearch)
  }

  onRecommendationsSubmit(event) {
    event.preventDefault()
    const opts = {}
    for (const feature of Features.fields) {
      if (this.state.hasOwnProperty(feature)) {
        opts[feature] = this.state[feature]
      }
    }
    console.log(opts)
    const api = new SpotifyApi(this.props.token)
    api.getRecommendations(opts).then(json => this.onRecommendations(json)).
      catch(err => this.onRecommendationsError(err))
  }

  onRecommendations(json) {
    console.log(json)
  }

  onRecommendationsError(error) {
    console.error('failed to fetch recommendations', error)
  }

  onChange(event, feature) {
    const newState = {}
    newState[feature] = parseFloat(event.target.value)
    this.setState(newState)
  }

  onSeedTypeChange(event) {
    this.setState({ seedType: event.target.value, seed: null, seedQuery: '' })
  }

  onSeedQueryChange(event) {
    this.setState({ seedQuery: event.target.value }, () => {
      this.delayedSeedSearch()
    })
  }

  delayedSeedSearch() {
    this.onSeedSearch()
  }

  onSeedSearch(event) {
    if (event) {
      event.preventDefault()
    }
    const { seedType, seedQuery } = this.state
    if (!seedQuery || seedQuery.length < 1) {
      return
    }
    const opts = { q: seedQuery, type: seedType }
    const api = new SpotifyApi(this.props.token)
    api.search(opts).then(json => this.onSeedSearchResults(json)).
      catch(err => this.onSeedSearchError(err))
  }

  onSeedSearchResults(json) {
    const { seedType } = this.state
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
    console.error(`failed to search ${this.state.seedType}s`, error)
    if (error.response.status === 401) {
      this.props.unauthorized()
    }
  }

  chooseSeed(result) {
    this.setState({ seed: result, results: [], seedQuery: '' })
  }

  seedSummary() {
    const { seed, seedType } = this.state
    if (!seed) {
      return
    }
    if (seedType === 'track') {
      return <TrackSeedSummary {...seed} />
    }
    return <ArtistSeedSummary {...seed} />
  }

  seedSearchForm() {
    const { seed, seedType, seedQuery, results } = this.state
    if (seed) {
      return
    }
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
              placeholder={seedType === 'track' ? 'Search songs' : 'Search artists'}
            />
            <ul className="results" style={{display: results.length < 1 ? 'none' : 'block'}}>
              {results.map(result => {
                if (seedType === 'track') {
                  return (
                    <SearchResultTrack
                      key={result.id}
                      {...result}
                      chooseTrack={() => this.chooseSeed(result)}
                    />
                  )
                }
                return (
                  <SearchResultArtist
                    key={result.id}
                    {...result}
                    chooseArtist={() => this.chooseSeed(result)}
                  />
                )
              })}
            </ul>
          </div>
        </div>
        <div className="control">
          <label className="radio">
            <input
              type="radio"
              name="seed-type"
              checked={seedType === 'track'}
              value="track"
              onChange={e => this.onSeedTypeChange(e)}
            />
            Songs
          </label>
          <label className="radio">
            <input
              type="radio"
              name="seed-type"
              checked={seedType === 'artist'}
              value="artist"
              onChange={e => this.onSeedTypeChange(e)}
            />
            Artists
          </label>
        </div>
      </form>
    )
  }

  recommendationsForm() {
    const { seed } = this.state
    if (!seed) {
      return
    }
    return (
      <form onSubmit={e => this.onRecommendationsSubmit(e)}>
        <h4 className="refine-title title is-4">
          Step 2: Refine your results
        </h4>
        {Features.fields.map(feature => {
          return (
            <div key={feature} className="control is-horizontal">
              <div className="control-label">
                <label className="label" htmlFor={feature}>
                  {Features.labels[feature]}
                </label>
              </div>
              <div className="control">
                0%
                <input
                  onChange={e => this.onChange(e, feature)}
                  id={feature}
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                />
                100%
              </div>
            </div>
          )
        })}
        <div className="control is-horizontal">
          <div className="control-label"></div>
          <div className="control">
            <button
              type="submit"
              className="button is-primary is-large"
            >Find Songs</button>
          </div>
        </div>
      </form>
    )
  }

  render() {
    return (
      <div>
        {this.seedSearchForm()}
        {this.seedSummary()}
        {this.recommendationsForm()}
      </div>
    )
  }
}

Search.propTypes = {
  token: React.PropTypes.string.isRequired,
  unauthorized: React.PropTypes.func.isRequired
}

export default Search
