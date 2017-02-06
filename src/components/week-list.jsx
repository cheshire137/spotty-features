import React from 'react'

import WeekTrackList from './week-track-list.jsx'

class WeekList extends React.Component {
  render() {
    const { tracks, avgLoudness } = this.props
    const tracksByWeek = {}
    for (const track of tracks) {
      const key = track.week.toISOString()
      if (!tracksByWeek.hasOwnProperty(key)) {
        tracksByWeek[key] = []
      }
      tracksByWeek[key].push(track)
    }
    const weeks = Object.keys(tracksByWeek)
    return (
      <div className="week-list-container">
        <h2 className="title is-2">Recently saved tracks</h2>
        {weeks.map(weekStr => (
          <WeekTrackList
            key={weekStr}
            week={weekStr}
            tracks={tracksByWeek[weekStr]}
            avgLoudness={avgLoudness}
          />
        ))}
      </div>
    )
  }
}

WeekList.propTypes = {
  tracks: React.PropTypes.array.isRequired,
  avgLoudness: React.PropTypes.number.isRequired
}

export default WeekList
