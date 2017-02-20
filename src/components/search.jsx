import React from 'react'

import SpotifyApi from '../models/spotify-api'

import ArtistSeedSummary from './artist-seed-summary.jsx'
import RecommendationsForm from './recommendations-form.jsx'
import RecommendationsList from './recommendations-list.jsx'
import SeedSearchForm from './seed-search-form.jsx'
import TrackSeedSummary from './track-seed-summary.jsx'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seedType: 'track',
      recommendations: [],
      seedQuery: '',
      numRecommendations: 25,
      fetchedFeatures: false
    }
  }

  onRecommendations(recommendations) {
    this.setState({ recommendations })
  }

  onSeedTypeChange(seedType) {
    this.setState({
      seedType,
      seed: null,
      seedQuery: '',
      recommendations: [],
      features: {}
    })
  }

  onSeedQueryChange(event) {
    this.setState({ seedQuery: event.target.value })
  }

  chooseSeed(result) {
    this.setState({
      seed: result,
      seedQuery: ''
    }, () => this.getAudioFeaturesForSeed())
  }

  getAudioFeaturesForSeed() {
    const { seed, seedType } = this.state
    if (seedType !== 'track') {
      this.props.recommendationsFormShown()
      return
    }
    const api = new SpotifyApi(this.props.token)
    api.audioFeaturesForTrack(seed.id).
      then(json => this.onAudioFeatures(json)).
      catch(err => this.onAudioFeaturesError(err))
  }

  onAudioFeatures(features) {
    this.setState({ features, fetchedFeatures: true }, () => {
      this.props.recommendationsFormShown()
    })
  }

  onAudioFeaturesError(error) {
    console.error('failed to get audio features for track', error)
    if (error.response.status === 401) {
      this.props.unauthorized()
    }
  }

  seedSummary() {
    const { seed, seedType, recommendations } = this.state
    if (!seed || recommendations.length > 0) {
      return
    }
    if (seedType === 'track') {
      return <TrackSeedSummary {...seed} />
    }
    return <ArtistSeedSummary {...seed} />
  }

  seedSearchForm() {
    if (this.state.seed) {
      return
    }
    const { seedType, seedQuery } = this.state
    return (
      <SeedSearchForm
        onSeedTypeChange={e => this.onSeedTypeChange(e)}
        unauthorized={() => this.props.unauthorized()}
        chooseSeed={r => this.chooseSeed(r)}
        seedQuery={seedQuery}
        seedType={seedType}
        token={this.props.token}
        onSeedQueryChange={e => this.onSeedQueryChange(e)}
      />
    )
  }

  changeSeed() {
    this.setState({ seed: null, fetchedFeatures: false }, () => {
      this.props.recommendationsFormHidden()
    })
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
    const { recommendations, seed, seedType } = this.state
    if (recommendations.length < 1) {
      return
    }
    return (
      <RecommendationsList
        seed={seed}
        seedType={seedType}
        unauthorized={() => this.props.unauthorized()}
        recommendations={recommendations}
        token={this.props.token}
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
  unauthorized: React.PropTypes.func.isRequired,
  recommendationsFormShown: React.PropTypes.func.isRequired,
  recommendationsFormHidden: React.PropTypes.func.isRequired
}

export default Search
