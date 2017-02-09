import React from 'react'

import TrackRecommendation from './track-recommendation.jsx'

class RecommendationsList extends React.Component {
  render() {
    const { recommendations } = this.props
    return (
      <div className="content">
        <p>
          <button
            type="button"
            className="button is-link"
            onClick={() => this.props.changeAudioFeatures()}
          >&larr; Change filters</button>
        </p>
        <h4 className="title is-4 song-recs-title">
          Song recommendations (<span>{recommendations.length}</span>)
        </h4>
        <ul className="recommendations-list">
          {recommendations.map(track => {
            return <TrackRecommendation key={track.id} {...track} />
          })}
        </ul>
      </div>
    )
  }
}

RecommendationsList.propTypes = {
  recommendations: React.PropTypes.array.isRequired,
  changeAudioFeatures: React.PropTypes.func.isRequired
}

export default RecommendationsList
