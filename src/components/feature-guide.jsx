import React from 'react'

import Features from '../models/features'

class FeatureGuide extends React.Component {
  render() {
    const { activeView } = this.props
    let headerClass = 'title is-3 feature-guide-header'
    if (activeView === 'search') {
      headerClass += ' search-view'
    }
    return (
      <div>
        <h3 className={headerClass}>Audio features</h3>
        <dl className="feature-guide">
          <dt style={{ color: Features.colors.acousticness }}>Acoustic</dt>
          <dd>
            A confidence measure of whether the track is acoustic.
          </dd>
          <dt style={{ color: Features.colors.danceability }}>Danceable</dt>
          <dd>
            Describes how suitable a track is for dancing based on
            tempo, rhythm stability, beat strength, and regularity.
          </dd>
          <dt style={{ color: Features.colors.energy }}>Energetic</dt>
          <dd>
            A perceptual measure of intensity and activity. Energetic
            tracks are usually fast, loud, and noisy.
          </dd>
          <dt style={{ color: Features.colors.instrumentalness }}>Instrumental</dt>
          <dd>
            Whether a track lacks vocals.
          </dd>
          <dt style={{ color: Features.colors.liveness }}>Live</dt>
          <dd>
            Detects the presence of an audience.
          </dd>
          <dt>
            <span style={{ color: Features.colors.valence }}>Positive</span>
            <span> / </span>
            <span style={{ color: Features.colors.negativity }}>Negative</span>
          </dt>
          <dd>
            Describes the musical positiveness of the track. High
            positivity sounds more happy, cheerful, or euphoric. High
            negativity sounds more sad, depressed, or angry.
          </dd>
          <dt style={{ color: Features.colors.speechiness }}>Speechy</dt>
          <dd>
            Detects the presence of spoken words. More than 66%
            is probably entirely spoken. Between 33% - 66% may contain
            both music and speech. Less than 33% most likely is music.
          </dd>
        </dl>
      </div>
    )
  }
}

FeatureGuide.propTypes = {
  activeView: React.PropTypes.string.isRequired
}

export default FeatureGuide
