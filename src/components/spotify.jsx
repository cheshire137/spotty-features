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
    this.setState({
      tracks,
      weeklyAverages: this.getWeeklyAverages(tracks),
      avgLoudness: this.getAverageLoudness(tracks)
    })
  }

  getAverageLoudness(tracks) {
    let sum = 0
    for (const track of tracks) {
      sum += track.audioFeatures.loudness
    }
    return sum / tracks.length
  }

  getWeeklyAverages(tracks) {
    const features = ['acousticness', 'danceability', 'energy', 'valence',
                      'instrumentalness', 'liveness', 'speechiness']

    const valuesByWeek = {}
    for (const track of tracks) {
      const week = new Date(track.savedAt.getTime())
      week.setHours(0, 0, 0, 0)
      week.setDate(week.getDate() - week.getDay())
      const key = week.toISOString()

      if (!valuesByWeek.hasOwnProperty(key)) {
        valuesByWeek[key] = {}
        for (const feature of features) {
          valuesByWeek[key][feature] = []
        }
      }

      for (const feature in track.audioFeatures) {
        if (valuesByWeek[key].hasOwnProperty(feature)) {
          valuesByWeek[key][feature].push(track.audioFeatures[feature])
        }
      }
    }

    const averages = {}
    for (const feature of features) {
      averages[feature] = {}
      for (const week in valuesByWeek) {
        const values = valuesByWeek[week][feature]
        let sum = 0
        for (const value of values) {
          sum += value
        }
        averages[feature][week] = sum / values.length
      }
    }

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
      <div className="recently-saved-tracks-container">
        <h2 className="subtitle">Recently saved tracks</h2>
        <ul>
          {this.state.tracks.map(track => (
            <TrackListItem
              key={track.id}
              {...track}
              avgLoudness={this.state.avgLoudness}
            />
          ))}
        </ul>
      </div>
    )
  }

  audioFeaturesChart() {
    const { weeklyAverages } = this.state
    if (!weeklyAverages) {
      return
    }
    return <AudioFeaturesChart weeklyAverages={weeklyAverages} />
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
