import 'whatwg-fetch'

import Features from './features.js'

const apiUrl = 'https://api.spotify.com/v1'

export default class SpotifyApi {
  constructor(token) {
    this.token = token
    this.headers = { Authorization: `Bearer ${this.token}` }
  }

  me() {
    return this.get('/me')
  }

  search(opts) {
    const limit = opts.limit || 20
    const offset = opts.offset || 0
    const query = encodeURIComponent(opts.q)
    return this.get(`/search?q=${query}&type=${opts.type}&limit=${limit}` +
                    `&offset=${offset}`)
  }

  getRecommendations(opts) {
    const limit = opts.limit || 20
    const params = [`limit=${limit}`]
    for (const key in opts) {
      params.push(`${key}=${encodeURIComponent(opts[key])}`)
    }
    console.log(params.join('&'))
    return this.get(`/recommendations?${params.join('&')}`)
  }

  savedTracks(opts) {
    return this.tracks('/me/tracks', opts)
  }

  // https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/
  topTracks(opts) {
    return this.tracks('/me/top/tracks', opts)
  }

  savedTracksForPastMonths(numMonths) {
    const pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - numMonths)
    pastDate.setHours(0, 0, 0, 0)

    return new Promise((resolve, reject) => {
      this.savedTracksBeforeDate(pastDate, [], resolve, reject, 0)
    })
  }

  savedTracksForXWeeks(numWeeks) {
    return new Promise((resolve, reject) => {
      const items = []
      const offset = 0
      const weeksFound = 0
      const weeks = []
      this.getTracksForXWeeks('/me/tracks', numWeeks, items, resolve, reject,
                              offset, weeksFound, weeks)
    })
  }

  topTracksForXWeeks(numWeeks) {
    return new Promise((resolve, reject) => {
      const items = []
      const offset = 0
      const weeksFound = 0
      const weeks = []
      this.getTracksForXWeeks('/me/top/tracks', numWeeks, items, resolve, reject,
                              offset, weeksFound, weeks)
    })
  }

  audioFeaturesForTrack(id) {
    return this.get(`/audio-features/${id}`)
  }

  audioFeatures(allIDs) {
    const chunkSize = 100
    if (allIDs.length <= chunkSize) {
      return this.audioFeaturesForIDs(allIDs)
    }
    return new Promise((resolve, reject) => {
      const batches = []
      for (let i = 0; i < allIDs.length; i += chunkSize) {
        batches.push(allIDs.slice(i, i + chunkSize))
      }
      this.audioFeaturesForBatch(batches, 0, [], resolve, reject)
    })
  }



  /* Internal: */

  tracks(path, opts) {
    const options = opts || {}
    const limit = options.limit || 10
    const offset = options.offset || 0
    return this.get(`${path}?limit=${limit}&offset=${offset}`)
  }

  getTracksForXWeeks(path, numWeeks, items, resolve, reject, offset, weeksFound, weeks) {
    this.tracks(path, { limit: 50, offset }).then(json => {
      const itemsByWeek = {}
      for (const item of json.items) {
        const week = this.getWeek(item.added_at).toISOString()
        if (!itemsByWeek.hasOwnProperty(week)) {
          itemsByWeek[week] = []
        }
        itemsByWeek[week].push(item)
      }
      const newWeeks = Object.keys(itemsByWeek)
      let weeksAdded = 0
      for (const week of newWeeks) {
        const weekAlreadySeen = weeks.indexOf(week) > -1
        if (weeksFound + weeksAdded < numWeeks || weekAlreadySeen) {
          for (const item of itemsByWeek[week]) {
            items.push(item)
          }
          if (!weekAlreadySeen) {
            weeksAdded++
          }
        } else {
          break
        }
      }

      if (weeksFound + weeksAdded >= numWeeks) {
        resolve(items)
      } else {
        this.getTracksForXWeeks(path, numWeeks, items, resolve, reject,
                                offset + 50, weeksFound + weeksAdded,
                                weeks.concat(newWeeks))
      }
    }).catch(error => {
      reject(error)
    })
  }

  getWeek(dateStr) {
    const week = new Date(dateStr)
    week.setHours(0, 0, 0, 0)
    week.setDate(week.getDate() - week.getDay())
    return week
  }

  savedTracksBeforeDate(pastDate, items, resolve, reject, offset) {
    this.savedTracks({ limit: 50, offset }).then(json => {
      const dates = []
      for (const item of json.items) {
        const date = new Date(item.added_at)
        dates.push(date)
        if (date >= pastDate) {
          items.push(item)
        }
      }
      dates.sort()
      const earliestDate = dates[0]
      if (earliestDate < pastDate) {
        resolve(items)
      } else {
        this.savedTracksBeforeDate(pastDate, items, resolve, reject, offset + 50)
      }
    }).catch(error => {
      reject(error)
    })
  }

  audioFeaturesForBatch(batches, index, prevFeatures, resolve, reject) {
    this.audioFeaturesForIDs(batches[index]).then(features => {
      const allFeatures = prevFeatures.concat(features)
      if (index < batches.length - 1) {
        this.audioFeaturesForBatch(batches, index + 1, allFeatures, resolve,
                                   reject)
      } else {
        resolve(allFeatures)
      }
    }).catch(error => {
      reject(error)
    })
  }

  audioFeaturesForIDs(ids) {
    return new Promise((resolve, reject) => {
      const idStr = ids.join(',')
      this.get(`/audio-features?ids=${idStr}`).then(json => {
        resolve(json.audio_features)
      }).catch(error => {
        reject(error)
      })
    })
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  parseJson(response) {
    return response.json()
  }

  get(path) {
    const url = `${apiUrl}${path}`
    return fetch(url, { headers: this.headers }).
      then(this.checkStatus).
      then(this.parseJson)
  }
}
