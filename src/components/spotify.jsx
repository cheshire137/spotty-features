import React from 'react'

import Features from '../models/features.js'
import LocalStorage from '../models/local-storage.js'
import SpotifyApi from '../models/spotify-api.js'

import AudioFeaturesChart from './audio-features-chart.jsx'
import FeatureGuide from './feature-guide.jsx'
import Search from './search.jsx'
import WeekList from './week-list.jsx'

export default class Spotify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: LocalStorage.get('spotify-token'),
      activeChart: 'all',
      activeView: 'trends'
    }
  }

  componentDidMount() {
    if (this.state.activeView === 'trends') {
      this.fetchTracks()
    }
  }

  fetchTracks() {
    const api = new SpotifyApi(this.state.token)
    api.savedTracksForXWeeks(14).then(json => this.onTracksFetched(json)).
      catch(err => this.onTracksFetchError(err))
  }

  onTracksFetchError(error) {
    console.error(`failed to load your saved tracks`, error)
    if (error.response.status === 401) {
      LocalStorage.delete('spotify-token')
      LocalStorage.delete('spotify-user')
      LocalStorage.delete('spotify-avatar-url')
      this.props.router.push('/')
    }
  }

  onTracksFetched(items) {
    const trackIDs = items.map(item => item.track.id)
    if (trackIDs.length < 1) {
      this.setState({ message: 'You have no saved tracks to show.' })
      return
    }
    const tracksByID = {}
    for (const item of items) {
      const savedAt = new Date(item.added_at)
      tracksByID[item.track.id] = {
        id: item.track.id,
        savedAt,
        week: this.getWeek(savedAt),
        name: item.track.name,
        artists: item.track.artists.map(artist => artist.name),
        album: item.track.album.name,
        image: item.track.album.images.filter(img => img.width < 100)[0].url,
        url: item.track.external_urls.spotify,
        albumUrl: item.track.album.external_urls.spotify
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
      message: null,
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

  getWeek(date) {
    const week = new Date(date.getTime())
    week.setHours(0, 0, 0, 0)
    week.setDate(week.getDate() - week.getDay())
    return week
  }

  getWeeklyAverages(tracks) {
    const features = ['acousticness', 'danceability', 'energy', 'valence',
                      'instrumentalness', 'liveness', 'speechiness',
                      'negativity']

    const valuesByWeek = {}
    for (const track of tracks) {
      const week = this.getWeek(track.savedAt)
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
      valence: feature.valence,
      negativity: 1 - feature.valence
    }
    return track
  }

  weekList() {
    const { tracks, avgLoudness, activeView } = this.state
    if (!tracks || activeView !== 'trends') {
      return
    }
    return <WeekList tracks={tracks} avgLoudness={avgLoudness} />
  }

  search() {
    const { activeView } = this.state
    if (activeView !== 'search') {
      return
    }
    return <Search />
  }

  setActiveChart(event, activeChart) {
    event.preventDefault()
    this.setState({ activeChart })
  }

  audioFeaturesCharts() {
    const { weeklyAverages, activeChart, activeView } = this.state
    if (!weeklyAverages || activeView !== 'trends') {
      return
    }
    const weekCount = Object.keys(weeklyAverages.acousticness).length
    if (weekCount < 2) {
      return
    }
    return (
      <div>
        <div className="tabs">
          <ul>
            <li className={activeChart === 'all' ? 'is-active' : ''}>
              <a href="#" onClick={e => this.setActiveChart(e, 'all')}>
                All features
              </a>
            </li>
            <li className={activeChart === 'mood' ? 'is-active' : ''}>
              <a href="#" onClick={e => this.setActiveChart(e, 'mood')}>
                Mood
              </a>
            </li>
            <li className={activeChart === 'party' ? 'is-active' : ''}>
              <a href="#" onClick={e => this.setActiveChart(e, 'party')}>
                Party
              </a>
            </li>
            <li className={activeChart === 'focus' ? 'is-active' : ''}>
              <a href="#" onClick={e => this.setActiveChart(e, 'focus')}>
                Focus
              </a>
            </li>
          </ul>
        </div>
        <AudioFeaturesChart
          type={activeChart}
          weeklyAverages={weeklyAverages}
        />
      </div>
    )
  }

  message() {
    const { message } = this.state
    if (message && message.length > 0) {
      return (
        <p className="notification">{message}</p>
      )
    }
  }

  setActiveView(event, activeView) {
    event.preventDefault()
    this.setState({ activeView }, () => {
      if (!this.state.weeklyAverages) {
        this.fetchTracks()
      }
    })
  }

  render() {
    const { activeView } = this.state
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
          <div className="hero-foot">
            <div className="container">
              <nav className="tabs is-boxed">
                <ul>
                  <li className={activeView === 'trends' ? 'is-active' : ''}>
                    <a
                      href="#"
                      onClick={e => this.setActiveView(e, 'trends')}
                    >Trends</a>
                  </li>
                  <li className={activeView === 'search' ? 'is-active' : ''}>
                    <a
                      href="#"
                      onClick={e => this.setActiveView(e, 'search')}
                    >Find songs by feature</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="container" id="spotify-container">
            {this.audioFeaturesCharts()}
            <div className="columns">
              <div className="column is-two-thirds">
                {this.message()}
                {this.weekList()}
                {this.search()}
              </div>
              <div className="column">
                <FeatureGuide />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
