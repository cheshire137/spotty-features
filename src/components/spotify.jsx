import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

export default class Spotify extends React.Component {
  componentDidMount() {
    const token = LocalStorage.get('spotify-token')
  }

  render() {
    return <p>You are signed into Spotify.</p>
  }
}
