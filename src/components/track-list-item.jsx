import React from 'react'

import AudioFeatures from './audio-features.jsx'

class TrackListItem extends React.Component {
  audioFeatures() {
    if (!this.props.audioFeatures) {
      return
    }
    return (
      <AudioFeatures
        avgLoudness={this.props.avgLoudness}
        {...this.props.audioFeatures}
      />
    )
  }

  render() {
    const { image, name, artists, album, savedAt } = this.props
    const date = savedAt.toLocaleDateString()
    return (
      <li>
        <div className="columns">
          <div className="column track-image-column">
            <img src={image} className="track-image" />
          </div>
          <div className="column">
            <span className="track-name">{name}</span>
            <span> by </span>
            <span className="track-artists">{artists.join(', ')}</span>
            <span className="track-album">{album}</span>
            <span className="track-saved-at">Saved {date}</span>
            {this.audioFeatures()}
          </div>
        </div>
      </li>
    )
  }
}

TrackListItem.propTypes = {
  image: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  artists: React.PropTypes.array.isRequired,
  album: React.PropTypes.string.isRequired,
  audioFeatures: React.PropTypes.object,
  savedAt: React.PropTypes.instanceOf(Date).isRequired,
  avgLoudness: React.PropTypes.number.isRequired
}

export default TrackListItem
