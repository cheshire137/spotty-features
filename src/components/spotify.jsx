import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

import TrackListItem from './track-list-item.jsx'

export default class Spotify extends React.Component {
  constructor(props) {
    super(props)
    this.state = { token: LocalStorage.get('spotify-token') }
  }

  componentDidMount() {
    this.fetchSavedTracks()
  }

  fetchSavedTracks() {
    const api = new SpotifyApi(this.state.token)
    api.myTracks().
      then(json => this.onSavedTracks(json)).
      catch(err => this.onSavedTracksError(err))
  }

  onSavedTracksError(error) {
    console.error('failed to load your saved tracks', error)
    if (error.response.status === 401) {
      LocalStorage.delete('spotify-token')
      this.props.router.push('/')
    }
  }

  onSavedTracks(json) {
    const trackIDs = json.items.map(item => item.track.id)
    if (trackIDs.length < 1) {
      return
    }
    const tracksByID = {}
    for (const item of json.items) {
      tracksByID[item.track.id] = {
        id: item.track.id,
        savedAt: new Date(item.added_at),
        name: item.track.name,
        artists: item.track.artists.map(artist => artist.name),
        album: item.track.album.name,
        image: item.track.album.images.filter(img => img.width < 100)[0].url
      }
    }
    this.fetchAudioFeatures(trackIDs, tracksByID)
  }

  fetchAudioFeatures(trackIDs, tracksByID) {
    const api = new SpotifyApi(this.state.token)
    api.audioFeatures(trackIDs).then(json => this.onAudioFeatures(json, tracksByID))
  }

  onAudioFeatures(json, tracksByID) {
    const tracks = []
    for (const feature of json.audio_features) {
      tracks.push(this.addAudioFeaturesToTrack(feature, tracksByID[feature.id]))
    }
    const dailyAverages = this.getDailyAverages(tracks)
    this.setState({ tracks })
  }

  getDailyAverages(tracks) {
    const valuesByDay = {}
    for (const track of tracks) {
      const day = new Date(track.savedAt.getTime())
      day.setHours(0, 0, 0, 0)

      if (!valuesByDay.hasOwnProperty(day)) {
        valuesByDay[day] = {
          acousticness: [],
          danceability: [],
          energy: [],
          instrumentalness: [],
          liveness: [],
          loudness: [],
          speechiness: [],
          valence: []
        }
      }

      for (const feature in track.audioFeatures) {
        valuesByDay[day][feature].push(track.audioFeatures[feature])
      }
    }

    const averages = {}
    for (const day in valuesByDay) {
      averages[day] = {}
      const features = valuesByDay[day]
      for (const feature in features) {
        const values = valuesByDay[day][feature]
        let sum = 0
        for (const value of values) {
          sum += value
        }
        averages[day][feature] = sum / values.length
      }
    }
    console.log(averages)
    return averages
  }

  addAudioFeaturesToTrack(feature, track) {
    track.audioFeatures = {
      acousticness: feature.acousticness,
      danceability: feature.danceability,
      energy: feature.energy,
      instrumentalness: feature.instrumentalness,
      liveness: feature.liveness,
      loudness: feature.loudness,
      speechiness: feature.speechiness,
      valence: feature.valence
    }
    return track
  }

  trackList() {
    if (!this.state.tracks) {
      return
    }
    return (
      <div>
        <h2 className="subtitle">Recently saved tracks</h2>
        <ul>
          {this.state.tracks.map(track => <TrackListItem key={track.id} {...track} />)}
        </ul>
      </div>
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
