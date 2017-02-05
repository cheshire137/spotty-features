import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

export default class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const token = LocalStorage.get('spotify-token')
    const api = new SpotifyApi(token)
    api.me().then(json => {
      console.log('me', json)
      this.setState({ username: json.display_name })
    })
  }

  logout(event) {
    event.preventDefault()
    LocalStorage.delete('spotify-token')
    this.props.router.push('/')
  }

  logoutLink() {
    if (!this.state.username) {
      return
    }
    return (
      <a className="nav-item" href="#" onClick={e => this.logout(e)}>
        <span>Log out </span>
        <span className="username">{this.state.username}</span>
      </a>
    )
  }

  render() {
    return (
      <div>
        <div className="container">
          <nav className="nav">
            <div className="nav-right nav-menu">
              {this.logoutLink()}
            </div>
          </nav>
        </div>
        <div className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                <a href="/">Spotty Features</a>
              </h1>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="container">
            {this.props.children}
          </div>
        </section>
      </div>
    )
  }
}
