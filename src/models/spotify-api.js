import 'whatwg-fetch'

const apiUrl = 'https://api.spotify.com/v1'

export default class SpotifyApi {
  constructor(token) {
    this.token = token
    this.headers = { Authorization: `Bearer ${this.token}` }
  }

  me() {
    return this.get('/me')
  }

  myTracks(opts) {
    const options = opts || {}
    const limit = options.limit || 10
    const offset = options.offset || 0
    return this.get(`/me/tracks?limit=${limit}&offset=${offset}`)
  }

  audioFeatures(ids) {
    const idsStr = ids.join(',')
    return this.get(`/audio-features?ids=${idsStr}`)
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
    console.log('GET', url)
    return fetch(url, { headers: this.headers }).
      then(this.checkStatus).
      then(this.parseJson)
  }
}
