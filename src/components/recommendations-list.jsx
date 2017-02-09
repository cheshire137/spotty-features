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
          href={playlist.external_urls.spotify} target="_blank"
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
        onPlaylistCreated={p => this.onPlaylistCreated(p)}
      />
    )
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
        <h4 className="title is-4 song-recs-title">
          Song recommendations (<span>{recommendations.length}</span>)
        </h4>
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
  seed: React.PropTypes.object.isRequired,
  seedType: React.PropTypes.string.isRequired
}

export default RecommendationsList
