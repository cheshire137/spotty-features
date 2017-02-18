import React from 'react'

class ArtistSeedSummary extends React.Component {
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
      <div className="columns seed-summary">
        {this.imageColumn()}
        <div className="column">
          <span className="track-name">{name}</span>
        </div>
      </div>
    )
  }
}

ArtistSeedSummary.propTypes = {
  image: React.PropTypes.string,
  name: React.PropTypes.string.isRequired
}

export default ArtistSeedSummary
