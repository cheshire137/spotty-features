import React from 'react'

class SearchResultArtist extends React.Component {
  render() {
    const { name, image } = this.props
    return (
      <li>
        <div className="columns">
          <div className="column track-image-column">
            <img src={image} className="track-image" />
          </div>
          <div className="column">
            <span className="track-name">{name}</span>
          </div>
        </div>
      </li>
    )
  }
}

SearchResultArtist.propTypes = {
  image: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

export default SearchResultArtist
