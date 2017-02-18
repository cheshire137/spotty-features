import React from 'react'

import TrackListItem from './track-list-item.jsx'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
]

class WeekTrackList extends React.Component {
  label() {
    const date = new Date(this.props.week)
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `Week of ${month} ${day}, ${year}`
  }

  trackCount() {
    const count = this.props.tracks.length
    if (count === 1) {
      return 'Saved 1 track'
    }
    return `Saved ${count} tracks`
  }

  render() {
    const { tracks, avgLoudness } = this.props
    return (
      <dl className="week-track-list">
        <dt className="title is-3">
          {this.label()}
          <span className="track-count">{this.trackCount()}</span>
        </dt>
        <dd>
          <ul>
            {tracks.map(track => (
              <TrackListItem
                key={track.id}
                {...track}
                avgLoudness={avgLoudness}
              />
            ))}
          </ul>
        </dd>
      </dl>
    )
  }
}

WeekTrackList.propTypes = {
  week: React.PropTypes.string.isRequired,
  tracks: React.PropTypes.array.isRequired,
  avgLoudness: React.PropTypes.number.isRequired
}

export default WeekTrackList
