import React from 'react'

import LocalStorage from '../models/local-storage'
import SpotifyApi from '../models/spotify-api'

class PlaylistForm extends React.Component {
  constructor(props) {
    super(props)
    if (props.seedType === 'artist') {
      this.state = {
        name: `Like ${props.seed.name}`
      }
    } else {
      const track = props.seed
      const trackTitle = track.name
      const artist = track.artists[0]
      this.state = {
        name: `Like ${trackTitle} by ${artist}`
      }
    }
  }

  onSubmit(event) {
    const { token, recommendations } = this.props
    event.preventDefault()
    const name = this.state.name
    const userID = LocalStorage.get('spotify-user-id')
    const trackURIs = recommendations.map(track => track.spotifyUri)
    const api = new SpotifyApi(token)
    api.createPlaylist(userID, trackURIs, { name }).
      then(json => this.onPlaylistCreated(json)).
      catch(err => this.onPlaylistCreateError(err))
  }

  onPlaylistCreated(json) {
    this.props.onPlaylistCreated(json)
  }

  onPlaylistCreateError(error) {
    console.error('failed to create playlist', error)
    if (error.response.status === 401) {
      this.props.unauthorized()
    } else {
      this.setState({ error: `Could not create playlist: ${error}` })
    }
  }

  changeName(event) {
    this.setState({ name: event.target.value })
  }

  errorMessage() {
    const { error } = this.state
    if (!error || error.length < 1) {
      return
    }
    return (
      <p className="notification is-danger">
        {error}
      </p>
    )
  }

  render() {
    const { name } = this.state
    return (
      <form
        className="playlist-form"
        onSubmit={e => this.onSubmit(e)}
      >
        {this.errorMessage()}
        <div className="control has-addons">
          <input
            type="text"
            value={name}
            className="input is-expanded is-large"
            onChange={e => this.changeName(e)}
          />
          <button type="submit" className="button is-large is-primary">
            Create Playlist
          </button>
        </div>
      </form>
    )
  }
}

PlaylistForm.propTypes = {
  recommendations: React.PropTypes.array.isRequired,
  token: React.PropTypes.string.isRequired,
  onPlaylistCreated: React.PropTypes.func.isRequired,
  seed: React.PropTypes.object.isRequired,
  unauthorized: React.PropTypes.func.isRequired,
  seedType: React.PropTypes.string.isRequired
}

export default PlaylistForm
