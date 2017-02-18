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

  imageColumn() {
    const { image, albumUrl } = this.props
    if (!image || image.length < 1) {
      return
    }
    return (
      <div className="column track-image-column">
        <a
          href={albumUrl}
          className="track-link"
          target="_blank"
          rel="noopener noreferrer"
        ><img src={image} className="track-image" /></a>
      </div>
    )
  }

  render() {
    const { name, artists, album, savedAt, url, albumUrl } = this.props
    const date = savedAt.toLocaleDateString()
    return (
      <li>
        <div className="columns">
          {this.imageColumn()}
          <div className="column">
            <a
              href={url}
              className="track-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="track-name">{name}</span>
              <span> by </span>
              <span className="track-artists">{artists.join(', ')}</span>
            </a>
            <a
              href={albumUrl}
              className="track-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="track-album">{album}</span>
            </a>
            <span className="track-saved-at">Saved {date}</span>
            {this.audioFeatures()}
          </div>
        </div>
      </li>
    )
  }
}

TrackListItem.propTypes = {
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  artists: React.PropTypes.array.isRequired,
  album: React.PropTypes.string.isRequired,
  albumUrl: React.PropTypes.string.isRequired,
  audioFeatures: React.PropTypes.object,
  savedAt: React.PropTypes.instanceOf(Date).isRequired,
  avgLoudness: React.PropTypes.number.isRequired
}

export default TrackListItem
