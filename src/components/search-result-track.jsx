import React from 'react'

class SearchResultTrack extends React.Component {
  imageColumn() {
    const { image } = this.props
    if (!image || image.length < 1) {
      return
    }
    return (
      <span className="column track-image-column">
        <img src={image} className="track-image" />
      </span>
    )
  }

  render() {
    const { name, artists, album, chooseTrack } = this.props
    return (
      <li>
        <button
          type="button"
          onClick={() => chooseTrack()}
          className="search-result-button"
        >
          <span className="columns">
            {this.imageColumn()}
            <span className="column">
              <span className="track-name">{name}</span>
              <span> by </span>
              <span className="track-artists">{artists.join(', ')}</span>
              <span className="track-album">{album}</span>
            </span>
          </span>
        </button>
      </li>
    )
  }
}

SearchResultTrack.propTypes = {
  artists: React.PropTypes.array.isRequired,
  album: React.PropTypes.string.isRequired,
  albumUrl: React.PropTypes.string.isRequired,
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  chooseTrack: React.PropTypes.func.isRequired
}

export default SearchResultTrack
