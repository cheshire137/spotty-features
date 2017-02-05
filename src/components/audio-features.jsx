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
      <dl className="audio-features">
        <dt className={acousticClass}>Acoustic:</dt>
        <dd className={acousticClass}>{this.percent(acousticness)}</dd>
        <dt className={danceClass}>Danceable:</dt>
        <dd className={danceClass}>{this.percent(danceability)}</dd>
        <dt className={energyClass}>Energy:</dt>
        <dd className={energyClass}>{this.percent(energy)}</dd>
        <dt className={instClass}>Instrumental:</dt>
        <dd className={instClass}>{this.percent(instrumentalness)}</dd>
        <dt className={liveClass}>Live:</dt>
        <dd className={liveClass}>{this.percent(liveness)}</dd>
        <dt>Loud:</dt>
        <dd>{loudness} dB</dd>
        <dt className={speechClass}>Speech:</dt>
        <dd className={speechClass}>{this.percent(speechiness)}</dd>
        <dt className={valClass}>Valence:</dt>
        <dd className={valClass}>{this.percent(valence)}</dd>
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
