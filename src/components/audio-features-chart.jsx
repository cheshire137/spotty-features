import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const featureColors = {
  acousticness: '#3273dc',
  danceability: '#23d160',
  energy: '#ffdd57',
  valence: '#ff3860',
  instrumentalness: '#00d1b2',
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

class AudioFeaturesChart extends React.Component {
  getChartData() {
    const { dailyAverages } = this.props

    const dates = Object.keys(dailyAverages.acousticness)
    dates.sort()

    const data = []
    for (const dateStr of dates) {
      const dateLabel = new Date(dateStr).toLocaleDateString()
      const datum = { dateLabel }
      for (const feature of features) {
        const value = dailyAverages[feature][dateStr]
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
    )
  }
}

AudioFeaturesChart.propTypes = {
  dailyAverages: React.PropTypes.object.isRequired
}

export default AudioFeaturesChart
