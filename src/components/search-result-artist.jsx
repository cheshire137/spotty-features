import React from 'react'

class SearchResultArtist extends React.Component {
  artistImage() {
    const { image } = this.props
    if (!image || image.length < 1) {
      return
    }
    return (
      <img src={image} className="track-image" />
    )
  }

  render() {
    const { name, chooseArtist, selected } = this.props
    return (
      <li
        className={selected ? 'selected' : ''}
        onMouseOver={() => this.props.select()}
      >
        <button
          type="button"
          className="search-result-button"
          onClick={() => chooseArtist()}
        >
          <span className="columns">
            <span className="column track-image-column">
              {this.artistImage()}
            </span>
            <span className="column search-result-details">
              <span className="track-name">{name}</span>
            </span>
          </span>
        </button>
      </li>
    )
  }
}

SearchResultArtist.propTypes = {
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  chooseArtist: React.PropTypes.func.isRequired,
  select: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool.isRequired
}

export default SearchResultArtist
