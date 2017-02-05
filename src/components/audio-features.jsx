import React from 'react'

class AudioFeatures extends React.Component {
  render() {
    return (
      <p>hey</p>
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
