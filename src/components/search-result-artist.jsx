import React from 'react'

class SearchResultArtist extends React.Component {
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
    const { name, chooseArtist } = this.props
    return (
      <li>
        <button
          type="button"
          className="search-result-button"
          onClick={() => chooseArtist()}
        >
          <span className="columns">
            {this.imageColumn()}
            <span className="column">
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
  url: React.PropTypes.string.isRequired,
  chooseArtist: React.PropTypes.func.isRequired
}

export default SearchResultArtist
