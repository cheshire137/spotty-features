import React from 'react'

import Features from '../models/features.js'

class AudioFeatures extends React.Component {
  percent(number) {
    const percentage = Math.round(number * 100)
    return `${percentage}%`
  }

  acoustic() {
    const { acousticness } = this.props
    if (acousticness <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.acousticness}}
        title={this.percent(acousticness)}>Acoustic</span>
    )
  }

  danceable() {
    const { danceability } = this.props
    if (danceability <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.danceability}}
        title={this.percent(danceability)}>Danceable</span>
    )
  }

  energetic() {
    const { energy } = this.props
    if (energy <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.energy}}
        title={this.percent(energy)}>Energetic</span>
    )
  }

  instrumental() {
    const { instrumentalness } = this.props
    if (instrumentalness <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.instrumentalness}}
        title={this.percent(instrumentalness)}>Instrumental</span>
    )
  }

  live() {
    const { liveness } = this.props
    if (liveness <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.liveness}}
        title={this.percent(liveness)}>Live</span>
    )
  }

  speechy() {
    const { speechiness } = this.props
    if (speechiness <= 0.5) {
      return
    }
    return (
      <span
        style={{color: Features.colors.speechiness}}
        title={this.percent(speechiness)}>Speechy</span>
    )
  }

  positiveNegative() {
    const { valence } = this.props
    const percentage = this.percent(valence)
    if (valence > 0.5) {
      return (
        <span
          style={{color: Features.colors.valence}}
          title={percentage}>Positive</span>
      )
    }
    return (
      <span
        style={{color: Features.colors.negativity}}
        title={percentage}>Negative</span>
    )
  }

  render() {
    const { loudness, avgLoudness } = this.props
    let loudnessClass = 'loudness-quiet'
    if (loudness && avgLoudness && loudness > avgLoudness) {
      loudnessClass = 'loudness-loud'
    }
    return (
      <p className="audio-features">
        {this.acoustic()}
        {this.danceable()}
        {this.energetic()}
        {this.instrumental()}
        {this.live()}
        <span className={loudnessClass}>{loudness} dB</span>
        {this.speechy()}
        {this.positiveNegative()}
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
