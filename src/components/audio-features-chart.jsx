import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const featureColors = {
  acousticness: '#3273dc',
  danceability: '#23d160',
  energy: '#ffdd57',
  valence: '#ff3860',
  instrumentalness: '#494949',
  liveness: '#A800D1',
  speechiness: '#D16200'
}
const featureLabels = {
  acousticness: 'Acoustic',
  danceability: 'Danceable',
  energy: 'Energetic',
  valence: 'Positive',
  instrumentalness: 'Instrumental',
  liveness: 'Live',
  speechiness: 'Speechy'
}
const features = Object.keys(featureColors)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                'Sep', 'Oct', 'Nov', 'Dec']

class AudioFeaturesChart extends React.Component {
  dateLabel(date, includeYear) {
    const month = months[date.getMonth()]
    const day = date.getDate()
    if (!includeYear) {
      return `${month} ${day}`
    }
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  getChartData() {
    const { weeklyAverages } = this.props

    const dates = Object.keys(weeklyAverages.acousticness)
    dates.sort()

    const data = []
    let prevYear = null
    for (const dateStr of dates) {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const includeYear = prevYear !== year
      prevYear = year
      const datum = { dateLabel: this.dateLabel(date, includeYear) }
      for (const feature of features) {
        const value = weeklyAverages[feature][dateStr]
        datum[featureLabels[feature]] = Math.round(value * 100)
      }
      data.push(datum)
    }
    return data
  }

  render() {
    const data = this.getChartData()
    const width = document.getElementById('spotify-container').clientWidth

    return (
      <div>
        <h2 className="title is-2">How your listening habits have changed</h2>
        <LineChart width={width} height={300} data={data}>
          <XAxis dataKey="dateLabel" />
          <YAxis type="number" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          {features.map(feature => {
            return (
              <Line
                key={feature}
                type="monotone"
                dataKey={featureLabels[feature]}
                stroke={featureColors[feature]}
              />
            )
          })}
        </LineChart>
      </div>
    )
  }
}

AudioFeaturesChart.propTypes = {
  weeklyAverages: React.PropTypes.object.isRequired
}

export default AudioFeaturesChart
