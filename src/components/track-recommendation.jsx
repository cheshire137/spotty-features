import React from 'react'

class TrackRecommendation extends React.Component {
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
    const { name, artists, album, url, albumUrl } = this.props
    return (
      <li>
        <div className="columns">
          {this.imageColumn()}
          <div className="column recommended-track-details">
            <a
              href={url}
              className="track-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="track-name">{name}</span>
              <span>by</span>
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
          </div>
        </div>
      </li>
    )
  }
}

TrackRecommendation.propTypes = {
  artists: React.PropTypes.array.isRequired,
  album: React.PropTypes.string.isRequired,
  albumUrl: React.PropTypes.string.isRequired,
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

export default TrackRecommendation
