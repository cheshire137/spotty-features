import React from 'react'

import TrackListItem from './track-list-item.jsx'

class WeekTrackList extends React.Component {
  render() {
    const { week, tracks, avgLoudness } = this.props
    return (
      <dl>
        <dt>{week}</dt>
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
