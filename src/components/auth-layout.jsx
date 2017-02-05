import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

export default class AuthLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('spotify-token'),
      username: LocalStorage.get('spotify-user'),
      avatarUrl: LocalStorage.get('spotify-avatar-url')
    }
  }

  componentDidMount() {
    if (!this.state.username || !this.state.avatarUrl) {
      this.fetchUser()
    }
  }

  fetchUser() {
    const api = new SpotifyApi(this.state.token)
    api.me().then(json => {
      LocalStorage.set('spotify-user', json.display_name)
      let avatarUrl = null
      if (json.images && json.images.length > 0) {
        avatarUrl = json.images[0].url
        LocalStorage.set('spotify-avatar-url', avatarUrl)
      }
      this.setState({
        username: json.display_name,
        avatarUrl
      })
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
    let image = ''
    if (this.state.avatarUrl) {
      image = <img src={this.state.avatarUrl} className="icon" />
    }
    return (
      <a className="nav-item" href="#" onClick={e => this.logout(e)}>
        {image}
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
