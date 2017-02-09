import React from 'react'

import Features from '../models/features.js'
import SpotifyApi from '../models/spotify-api.js'

class RecommendationsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      features: {
        acousticness: props.features.acousticness || 0.5,
        danceability: props.features.danceability || 0.5,
        energy: props.features.energy || 0.5,
        valence: props.features.valence || 0.5,
        instrumentalness: props.features.instrumentalness || 0.5,
        liveness: props.features.liveness || 0,
        speechiness: props.features.speechiness || 0
      }
    }
  }

  onSubmit(event) {
    const { seedType, seed, numRecommendations, token } = this.props
    event.preventDefault()
    const opts = { limit: numRecommendations }
    if (seedType === 'track') {
      opts.seed_tracks = seed.id
    } else {
      opts.seed_artists = seed.id
    }
    const { features } = this.state
    for (const feature of Features.fields) {
      if (features.hasOwnProperty(feature)) {
        opts[`target_${feature}`] = features[feature]
      }
    }
    const api = new SpotifyApi(token)
    api.getRecommendations(opts).
      then(json => this.onRecommendations(json)).
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
    this.props.onRecommendations(recommendations)
  }

  onRecommendationsError(error) {
    console.error('failed to fetch recommendations', error)
  }

  onNumRecommendationsChange(event) {
    const numRecommendations = parseInt(event.target.value, 10)
    this.props.onNumRecommendationsChange(numRecommendations)
  }

  onFeatureChange(event, feature) {
    const features = this.state.features
    features[feature] = parseFloat(event.target.value)
    this.setState({ features })
  }

  render() {
    const { numRecommendations, seedType } = this.props
    const { features } = this.state
    return (
      <div className="content">
        <p>
          <button
            type="button"
            className="button is-link"
            onClick={() => this.props.changeSeed()}
          >&larr; Change seed</button>
        </p>
        <form onSubmit={e => this.onSubmit(e)}>
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
                    value={features[feature]}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    className="slider"
                  />
                  <span className="feature-range-max">100%</span>
                  <span className="feature-percentage">
                    {Math.round(features[feature] * 100)}%
                  </span>
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
}

RecommendationsForm.propTypes = {
  changeSeed: React.PropTypes.func.isRequired,
  numRecommendations: React.PropTypes.number.isRequired,
  seed: React.PropTypes.object.isRequired,
  seedType: React.PropTypes.string.isRequired,
  token: React.PropTypes.string.isRequired,
  onNumRecommendationsChange: React.PropTypes.func.isRequired,
  onRecommendations: React.PropTypes.func.isRequired,
  features: React.PropTypes.object.isRequired,
}

export default RecommendationsForm
