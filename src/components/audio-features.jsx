import React from 'react'

class AudioFeatures extends React.Component {
  percent(number) {
    const percentage = Math.round(number * 100)
    return `${percentage}%`
  }

  classForScale(number) {
    if (number <= 0.25) {
      return 'audio-feature-25'
    }
    if (number <= 0.5) {
      return 'audio-feature-50'
    }
    if (number <= 0.75) {
      return 'audio-feature-75'
    }
    return 'audio-feature-100'
  }

  render() {
    const { acousticness, danceability, energy, instrumentalness, liveness,
            loudness, speechiness, valence } = this.props
    const acousticClass = this.classForScale(acousticness)
    const danceClass = this.classForScale(danceability)
    const energyClass = this.classForScale(energy)
    const instClass = this.classForScale(instrumentalness)
    const liveClass = this.classForScale(liveness)
    const speechClass = this.classForScale(speechiness)
    const valClass = this.classForScale(valence)
    return (
      <ul className="audio-features">
        <li title={this.percent(acousticness)} className={acousticClass}>
          Acoustic
        </li>
        <li title={this.percent(danceability)} className={danceClass}>
          Danceable
        </li>
        <li title={this.percent(energy)} className={energyClass}>
          Energetic
        </li>
        <li title={this.percent(instrumentalness)} className={instClass}>
          Instrumental
        </li>
        <li title={this.percent(liveness)} className={liveClass}>
          Live
        </li>
        <li>{loudness} dB</li>
        <li title={this.percent(speechiness)} className={speechClass}>
          Speechy
        </li>
        <li title={this.percent(valence)} className={valClass}>
          Positive
        </li>
      </ul>
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
