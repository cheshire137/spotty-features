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
            loudness, speechiness, valence, avgLoudness } = this.props
    const acousticClass = this.classForScale(acousticness)
    const danceClass = this.classForScale(danceability)
    const energyClass = this.classForScale(energy)
    const instClass = this.classForScale(instrumentalness)
    const liveClass = this.classForScale(liveness)
    const speechClass = this.classForScale(speechiness)
    const valClass = this.classForScale(valence)
    let loudnessClass = 'loudness-quiet'
    if (loudness && avgLoudness && loudness > avgLoudness) {
      loudnessClass = 'loudness-loud'
    }
    return (
      <p className="audio-features">
        <span title={this.percent(acousticness)} className={acousticClass}>
          Acoustic
        </span>
        <span title={this.percent(danceability)} className={danceClass}>
          Danceable
        </span>
        <span title={this.percent(energy)} className={energyClass}>
          Energetic
        </span>
        <span title={this.percent(instrumentalness)} className={instClass}>
          Instrumental
        </span>
        <span title={this.percent(liveness)} className={liveClass}>
          Live
        </span>
        <span className={loudnessClass}>{loudness} dB</span>
        <span title={this.percent(speechiness)} className={speechClass}>
          Speechy
        </span>
        <span title={this.percent(valence)} className={valClass}>
          Positive
        </span>
      </p>
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
  avgLoudness: React.PropTypes.number,
  speechiness: React.PropTypes.number,
  valence: React.PropTypes.number
}

export default AudioFeatures
