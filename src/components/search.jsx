import React from 'react'

import Features from '../models/features.js'

export default class Search extends React.Component {
  render() {
    return (
      <form>
        {Features.fields.map(feature => {
          return (
            <div key={feature} className="control is-horizontal">
              <div className="control-label">
                <label className="label" htmlFor={feature}>
                  {Features.labels[feature]}
                </label>
              </div>
              <div className="control">
                <input id={feature} type="range" />
              </div>
            </div>
          )
        })}
      </form>
    )
  }
}
