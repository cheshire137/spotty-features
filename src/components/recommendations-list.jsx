import React from 'react'

import PlaylistForm from './playlist-form.jsx'
import TrackRecommendation from './track-recommendation.jsx'

class RecommendationsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onPlaylistCreated(playlist) {
    this.setState({ playlist })
  }

  playlistMessage() {
    const { playlist } = this.state
    if (!playlist) {
      return
    }
    return (
      <p className="playlist-created notification is-success">
        <span>Created playlist </span>
        <a
          href={playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >{playlist.name}</a>!
      </p>
    )
  }

  playlistForm() {
    if (this.state.playlist) {
      return
    }
    const { recommendations, token, seed, seedType } = this.props
    return (
      <PlaylistForm
        recommendations={recommendations}
        token={token}
        seed={seed}
        seedType={seedType}
        unauthorized={() => this.props.unauthorized()}
        onPlaylistCreated={p => this.onPlaylistCreated(p)}
      />
    )
  }

  trackCount() {
    const count = this.props.recommendations.length
    if (count === 1) {
      return '1 song'
    }
    return `${count} songs`
  }

  render() {
    const { recommendations } = this.props
    return (
      <div className="content">
        <p>
          <button
            type="button"
            className="button is-link"
            onClick={() => this.props.changeAudioFeatures()}
          >&larr; Change filters</button>
        </p>
        <h3 className="title is-3 song-recs-title">
          Step 3: Save playlist (<span>{this.trackCount()}</span>)
        </h3>
        {this.playlistMessage()}
        {this.playlistForm()}
        <ul className="recommendations-list">
          {recommendations.map(track => {
            return <TrackRecommendation key={track.id} {...track} />
          })}
        </ul>
      </div>
    )
  }
}

RecommendationsList.propTypes = {
  recommendations: React.PropTypes.array.isRequired,
  changeAudioFeatures: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired,
  unauthorized: React.PropTypes.func.isRequired,
  seed: React.PropTypes.object.isRequired,
  seedType: React.PropTypes.string.isRequired
}

export default RecommendationsList
