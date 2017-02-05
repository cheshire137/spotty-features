import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

export default class Spotify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const token = LocalStorage.get('spotify-token')
    const api = new SpotifyApi(token)
    api.myTracks().then(json => {
      const tracks = []
      for (const item of json.items) {
        const track = {
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map(artist => artist.name),
          album: item.track.album.name,
          image: item.track.album.images.filter(img => img.width < 100)[0].url
        }
        tracks.push(track)
      }
      this.setState({ tracks: tracks })
    })
  }

  trackList() {
    if (!this.state.tracks) {
      return
    }
    return (
      <ul>
        {this.state.tracks.map(track => (
          <li key={track.id}>
            <div className="columns">
              <div className="column track-image-column">
                <img src={track.image} className="track-image" />
              </div>
              <div className="column">
                <span className="track-name">{track.name}</span>
                <span> by </span>
                <span className="track-artists">{track.artists.join(', ')}</span>
                <span className="track-album">{track.album}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
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
            {this.trackList()}
          </div>
        </section>
      </div>
    )
  }
}
