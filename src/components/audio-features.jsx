import React from 'react'

class AudioFeatures extends React.Component {
  render() {
    const { acousticness, danceability, energy, instrumentalness, liveness,
            loudness, speechiness, valence } = this.props
    return (
      <dl>
        <dt>Acoustic:</dt><dd>{acousticness}</dd>
        <dt>Danceable:</dt><dd>{danceability}</dd>
        <dt>Energy:</dt><dd>{energy}</dd>
        <dt>Instrumental:</dt><dd>{instrumentalness}</dd>
        <dt>Live:</dt><dd>{liveness}</dd>
        <dt>Loud:</dt><dd>{loudness}</dd>
        <dt>Speech:</dt><dd>{speechiness}</dd>
        <dt>Valence:</dt><dd>{valence}</dd>
      </dl>
    )
  }
}

AudioFeatures.propTypes = {
  acousticness: React.PropTypes.number,
  danceability: React.PropTypes.number,
  energy: React.PropTypes.number,
  instrumentalness: React.PropTypes.number,
  liveness: React.PropTypes.number,
  loudness: React.PropTypes.number,
  speechiness: React.PropTypes.number,
  valence: React.PropTypes.number
}

export default AudioFeatures
