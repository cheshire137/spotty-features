import React from 'react'

class SearchResultArtist extends React.Component {
  imageColumn() {
    const { image } = this.props
    if (!image || image.length < 1) {
      return
    }
    return (
      <div className="column track-image-column">
        <img src={image} className="track-image" />
      </div>
    )
  }

  render() {
    const { name } = this.props
    return (
      <li>
        <div className="columns">
          {this.imageColumn()}
          <div className="column">
            <span className="track-name">{name}</span>
          </div>
        </div>
      </li>
    )
  }
}

SearchResultArtist.propTypes = {
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

export default SearchResultArtist
