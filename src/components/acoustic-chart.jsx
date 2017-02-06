import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

class AcousticChart extends React.Component {
  render() {
    const { days } = this.props
    const dates = Object.keys(days)
    dates.sort()
    const data = []
    for (const dateStr of dates) {
      const date = new Date(dateStr)
      data.push({
        name: date.toLocaleDateString(),
        value: days[dateStr]
      })
    }
    console.log('acoustic data', data)
    return (
      <LineChart width={400} height={400} data={data}>
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3273dc" />
      </LineChart>
    )
  }
}

AcousticChart.propTypes = {
  days: React.PropTypes.object.isRequired
}

export default AcousticChart
