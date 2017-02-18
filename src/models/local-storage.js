const localStorageKey = 'spotty-features'

export default class LocalStorage {
  static getJSON() {
    if (!window.localStorage) {
      console.error('browser does not support local storage')
      return {}
    }
    const appData = window.localStorage.getItem(localStorageKey) || '{}'
    return JSON.parse(appData)
  }

  static has(key) {
    const value = this.get(key)
    return typeof value !== 'undefined'
  }

  static get(key) {
    const appData = this.getJSON()
    return appData[key]
  }

  static set(key, value) {
    const appData = this.getJSON()
    appData[key] = value
    window.localStorage.setItem(localStorageKey, JSON.stringify(appData))
  }

  static delete(key) {
    const appData = this.getJSON()
    delete appData[key]
    window.localStorage.setItem(localStorageKey, JSON.stringify(appData))
  }
}
