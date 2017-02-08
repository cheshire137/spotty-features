import React from 'react'

import Features from '../models/features.js'
import SpotifyApi from '../models/spotify-api.js'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = { seedType: 'song' }
  }

  onSubmit(event) {
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
    this.setState({ seedType: event.target.value })
  }

  onSeedChange(event) {
    this.setState({ seed: event.target.value.trim() })
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <div className="control">
          <label className="label" htmlFor="seed">
            Find songs like:
          </label>
          <input
            type="text"
            id="seed"
            className="input"
            onChange={e => this.onSeedChange(e)}
            placeholder="Search songs, artists, or genres"
          />
        </div>
        <div className="control">
          <label className="radio">
            <input
              type="radio"
              name="seed-type"
              checked={this.state.seedType === 'song'}
              value="song"
              onChange={e => this.onSeedTypeChange(e)}
            />
            Songs
          </label>
          <label className="radio">
            <input
              type="radio"
              name="seed-type"
              checked={this.state.seedType === 'artist'}
              value="artist"
              onChange={e => this.onSeedTypeChange(e)}
            />
            Artists
          </label>
          <label className="radio">
            <input
              type="radio"
              name="seed-type"
              checked={this.state.seedType === 'genre'}
              value="genre"
              onChange={e => this.onSeedTypeChange(e)}
            />
            Genres
          </label>
        </div>
        <h4 className="refine-title title is-4">
          Refine your results
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
}

Search.propTypes = {
  token: React.PropTypes.string.isRequired
}

export default Search
