import React from 'react'

import LocalStorage from '../models/local-storage.js'

export default class Spotify extends React.Component {
  render() {
    console.log(LocalStorage.get('spotify-token'))
    return <p>You are signed into Spotify.</p>
  }
}
