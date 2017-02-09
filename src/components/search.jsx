import React from 'react'
import { debounce } from 'throttle-debounce'

import ArtistSeedSummary from './artist-seed-summary.jsx'
import SearchResultArtist from './search-result-artist.jsx'
import SearchResultTrack from './search-result-track.jsx'
import TrackRecommendation from './track-recommendation.jsx'
import TrackSeedSummary from './track-seed-summary.jsx'

import Features from '../models/features.js'
import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seedType: 'track',
      results: [],
      recommendations: [],
      seedQuery: '',
      acousticness: 0.5,
      danceability: 0.5,
      energy: 0.5,
      valence: 0.5,
      instrumentalness: 0.5,
      liveness: 0,
      speechiness: 0,
      numRecommendations: 20
    }
    this.delayedSeedSearch = debounce(500, this.delayedSeedSearch)
  }

  onRecommendationsSubmit(event) {
    const { seedType, seed, numRecommendations } = this.state
    event.preventDefault()
    const opts = { limit: numRecommendations }
    if (seedType === 'track') {
      opts.seed_tracks = seed.id
    } else {
      opts.seed_artists = seed.id
    }
    for (const feature of Features.fields) {
      if (this.state.hasOwnProperty(feature)) {
        opts[`target_${feature}`] = this.state[feature]
      }
    }
    const api = new SpotifyApi(this.props.token)
    api.getRecommendations(opts).then(json => this.onRecommendations(json)).
      catch(err => this.onRecommendationsError(err))
  }

  onRecommendations(json) {
    const recommendations = []
    for (const item of json.tracks) {
      const images = item.album.images.filter(img => img.width < 100)
      const track = {
        id: item.id,
        name: item.name,
        artists: item.artists.map(artist => artist.name),
        album: item.album.name,
        url: item.external_urls.spotify,
        albumUrl: item.album.external_urls.spotify
      }
      if (images.length > 0) {
        track.image = images[0].url
      }
      recommendations.push(track)
    }
    this.setState({ recommendations })
  }

  onRecommendationsError(error) {
    console.error('failed to fetch recommendations', error)
  }

  onFeatureChange(event, feature) {
    const newState = {}
    newState[feature] = parseFloat(event.target.value)
    this.setState(newState)
  }

  onSeedTypeChange(event) {
    this.setState({
      seedType: event.target.value,
      seed: null,
      seedQuery: '',
      recommendations: []
    })
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
    this.setState({
      seed: result,
      results: [],
      seedQuery: ''
    }, () => this.getAudioFeaturesForSeed())
  }

  getAudioFeaturesForSeed() {
    const { seed, seedType } = this.state
    if (seedType !== 'track') {
      return
    }
    const api = new SpotifyApi(this.props.token)
    api.audioFeaturesForTrack(seed.id).
      then(json => this.onAudioFeatures(json)).
      catch(err => this.onAudioFeaturesError(err))
  }

  onAudioFeatures(json) {
    this.setState({
      acousticness: json.acousticness,
      danceability: json.danceability,
      energy: json.energy,
      valence: json.valence,
      instrumentalness: json.instrumentalness,
      liveness: json.liveness,
      speechiness: json.speechiness,
      fetchedFeatures: true
    })
  }

  onAudioFeaturesError(error) {
    console.error('failed to get audio features for track', error)
    if (error.response.status === 401) {
      this.props.unauthorized()
    }
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
    const placeholder = 'Search ' + (seedType === 'track' ? 'songs' : 'artists') + ' on Spotify'
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
              placeholder={placeholder}
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

  changeSeed() {
    this.setState({ seed: null, results: [], fetchedFeatures: false })
  }

  onNumRecommendationsChange(event) {
    const numRecommendations = parseInt(event.target.value, 10)
    this.setState({ numRecommendations })
  }

  recommendationsForm() {
    const { seed, recommendations, fetchedFeatures, seedType,
            numRecommendations } = this.state
    if (!seed || recommendations.length > 0) {
      return
    }
    return (
      <div className="content">
        <p>
          <button
            type="button"
            className="button is-link"
            onClick={() => this.changeSeed()}
          >&larr; Change seed</button>
        </p>
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
                  <span className="feature-range-min">0%</span>
                  <input
                    onChange={e => this.onFeatureChange(e, feature)}
                    id={feature}
                    value={this.state[feature]}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={!fetchedFeatures && seedType === 'track'}
                    className="slider"
                  />
                  <span className="feature-range-max">100%</span>
                  <span className="feature-percentage">{Math.round(this.state[feature] * 100)}%</span>
                </div>
              </div>
            )
          })}
          <div className="control">
            <label className="label" htmlFor="num-recommendations">
              How many songs to recommend:
            </label>
            <span className="select">
              <select
                id="num-recommendations"
                value={numRecommendations}
                onChange={e => this.onNumRecommendationsChange(e)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
            </span>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button is-primary is-large"
            >Find Songs</button>
          </div>
        </form>
      </div>
    )
  }

  changeAudioFeatures() {
    this.setState({ recommendations: [] })
  }

  recommendationsList() {
    const { recommendations } = this.state
    if (recommendations.length < 1) {
      return
    }
    return (
      <div className="content">
        <p>
          <button
            type="button"
            className="button is-link"
            onClick={() => this.changeAudioFeatures()}
          >&larr; Change filters</button>
        </p>
        <h4 className="title is-4 song-recs-title">
          Song recommendations (<span>{recommendations.length}</span>)
        </h4>
        <ul className="recommendations-list">
          {recommendations.map(track => {
            return <TrackRecommendation key={track.id} {...track} />
          })}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.seedSearchForm()}
        {this.seedSummary()}
        {this.recommendationsForm()}
        {this.recommendationsList()}
      </div>
    )
  }
}

Search.propTypes = {
  token: React.PropTypes.string.isRequired,
  unauthorized: React.PropTypes.func.isRequired
}

export default Search
