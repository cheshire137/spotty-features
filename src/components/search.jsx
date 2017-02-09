import React from 'react'
import { debounce } from 'throttle-debounce'

import ArtistSeedSummary from './artist-seed-summary.jsx'
import RecommendationsForm from './recommendations-form.jsx'
import RecommendationsList from './recommendations-list.jsx'
import SearchResultArtist from './search-result-artist.jsx'
import SearchResultTrack from './search-result-track.jsx'
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
      numRecommendations: 20,
      fetchedFeatures: false
    }
    this.delayedSeedSearch = debounce(500, this.delayedSeedSearch)
  }

  onRecommendations(recommendations) {
    this.setState({ recommendations })
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

  onAudioFeatures(features) {
    this.setState({ features, fetchedFeatures: true })
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

  onNumRecommendationsChange(numRecommendations) {
    this.setState({ numRecommendations })
  }

  recommendationsForm() {
    const { seed, recommendations, fetchedFeatures, seedType } = this.state
    if (!seed || recommendations.length > 0 ||
        seedType === 'track' && !fetchedFeatures) {
      return
    }
    const { numRecommendations, features } = this.state
    return (
      <RecommendationsForm
        changeSeed={() => this.changeSeed()}
        numRecommendations={numRecommendations}
        seed={seed}
        features={features}
        seedType={seedType}
        token={this.props.token}
        onRecommendations={r => this.onRecommendations(r)}
        onNumRecommendationsChange={n => this.onNumRecommendationsChange(n)}
      />
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
      <RecommendationsList
        recommendations={recommendations}
        changeAudioFeatures={() => this.changeAudioFeatures()}
      />
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
