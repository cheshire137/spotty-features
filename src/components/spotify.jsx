import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

export default class Spotify extends React.Component {
  componentDidMount() {
    const token = LocalStorage.get('spotify-token')
  }

  render() {
    return (
      <div>
        <div className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Your Listening Trends
              </h1>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="container">
            <p>You are signed into Spotify.</p>
          </div>
        </section>
      </div>
    )
  }
}
