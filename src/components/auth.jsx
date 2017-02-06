import React from 'react'
import Config from '../public/config.json'

export default class Auth extends React.Component {
  render() {
    const host = 'https://accounts.spotify.com'
    const redirectUri = `${window.location.protocol}//${window.location.host}/auth`
    const scopes = 'user-library-read'
    const authUrl = `${host}/authorize?response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&client_id=${Config.spotify.clientId}` +
      `&scope=${encodeURIComponent(scopes)}`
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h2 className="subtitle">
              Sign in with your Spotify account to see trends about your saved songs.
            </h2>
            <p>
              <a href={authUrl} className="button is-large is-primary">Sign into Spotify</a>
            </p>
          </div>
        </div>
      </section>
    )
  }
}
