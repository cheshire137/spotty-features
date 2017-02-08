import React from 'react'

class SearchResultTrack extends React.Component {
  render() {
    const { name, artists, album, image } = this.props
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
          </div>
        </div>
      </li>
    )
  }
}

SearchResultTrack.propTypes = {
  artists: React.PropTypes.array.isRequired,
  album: React.PropTypes.string.isRequired,
  albumUrl: React.PropTypes.string.isRequired,
  image: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

export default SearchResultTrack
