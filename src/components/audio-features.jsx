/* eslint-disable react/no-unused-prop-types */

import React from 'react'

import Features from '../models/features'

class AudioFeatures extends React.Component {
  percent(number) {
    const percentage = Math.round(number * 100)
    return `${percentage}%`
  }

  positiveNegative() {
    const { valence } = this.props
    const percentage = this.percent(valence)
    const title = `${percentage} positive`
    if (valence > 0.5) {
      return (
        <span
          style={{ color: Features.colors.valence }}
          title={title}
        >Positive</span>
      )
    }
    return (
      <span
        style={{ color: Features.colors.negativity }}
        title={title}
      >Negative</span>
    )
  }

  featureTag(key) {
    const value = this.props[key]
    if (value <= 0.5) {
      return
    }
    return (
      <span
        style={{ color: Features.colors[key] }}
        title={this.percent(value)}
      >{Features.labels[key]}</span>
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
        {this.featureTag('acousticness')}
        {this.featureTag('danceability')}
        {this.featureTag('energy')}
        {this.featureTag('instrumentalness')}
        {this.featureTag('liveness')}
        <span className={loudnessClass}>{loudness} dB</span>
        {this.featureTag('speechiness')}
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
