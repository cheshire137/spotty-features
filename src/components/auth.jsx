import React from 'react'
import Config from '../public/config.json'

export default class Auth extends React.Component {
  render() {
    const host = 'https://accounts.spotify.com'
    const redirectUri = `${window.location.protocol}//${window.location.host}/`
    const authUrl = `${host}/authorize?response_type=code` +
      `&redirect_uri=${redirectUri}&client_id=${Config.spotify.clientId}`
    return <a href={authUrl}>Sign into Spotify</a>;
  }
}
