import React from 'react'

class SearchResultTrack extends React.Component {
  albumImage() {
    const { image } = this.props
    if (!image || image.length < 1) {
      return
    }
    return (
      <img src={image} className="track-image" />
    )
  }

  render() {
    const { name, artists, album, chooseTrack, selected } = this.props
    return (
      <li
        className={selected ? 'selected' : ''}
        onMouseOver={() => this.props.select()}
      >
        <button
          type="button"
          onClick={() => chooseTrack()}
          className="search-result-button"
        >
          <span className="columns">
            <span className="column track-image-column">
              {this.albumImage()}
            </span>
            <span className="column search-result-details">
              <span className="track-name">{name}</span>
              <span>by</span>
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
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  chooseTrack: React.PropTypes.func.isRequired,
  select: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool.isRequired
}

export default SearchResultTrack
