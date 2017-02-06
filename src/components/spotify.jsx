import React from 'react'

import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

import AudioFeaturesChart from './audio-features-chart.jsx'
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
    api.myTracksForPastMonths(2).
      then(json => this.onSavedTracks(json)).
      catch(err => this.onSavedTracksError(err))
  }

  onSavedTracksError(error) {
    console.error('failed to load your saved tracks', error)
    if (error.response.status === 401) {
      LocalStorage.delete('spotify-token')
      LocalStorage.delete('spotify-user')
      LocalStorage.delete('spotify-avatar-url')
      this.props.router.push('/')
    }
  }

  onSavedTracks(items) {
    const trackIDs = items.map(item => item.track.id)
    if (trackIDs.length < 1) {
      return
    }
    const tracksByID = {}
    for (const item of items) {
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

  onAudioFeatures(audioFeatures, tracksByID) {
    const tracks = []
    for (const feature of audioFeatures) {
      tracks.push(this.addAudioFeaturesToTrack(feature, tracksByID[feature.id]))
    }
    const dailyAverages = this.getDailyAverages(tracks)
    this.setState({ tracks, dailyAverages })
  }

  getDailyAverages(tracks) {
    const features = ['acousticness', 'danceability', 'energy', 'valence',
                      'instrumentalness', 'liveness', 'loudness', 'speechiness']

    const valuesByDay = {}
    for (const track of tracks) {
      const day = new Date(track.savedAt.getTime())
      day.setHours(0, 0, 0, 0)
      const key = day.toISOString()

      if (!valuesByDay.hasOwnProperty(key)) {
        valuesByDay[key] = {}
        for (const feature of features) {
          valuesByDay[key][feature] = []
        }
      }

      for (const feature in track.audioFeatures) {
        valuesByDay[key][feature].push(track.audioFeatures[feature])
      }
    }

    const averages = {}
    for (const feature of features) {
      averages[feature] = {}
      for (const day in valuesByDay) {
        const values = valuesByDay[day][feature]
        let sum = 0
        for (const value of values) {
          sum += value
        }
        averages[feature][day] = sum / values.length
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

  audioFeaturesChart() {
    const { dailyAverages } = this.state
    if (!dailyAverages) {
      return
    }
    return <AudioFeaturesChart dailyAverages={dailyAverages} />
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
          <div className="container" id="spotify-container">
            {this.audioFeaturesChart()}
            {this.trackList()}
          </div>
        </section>
      </div>
    )
  }
}
