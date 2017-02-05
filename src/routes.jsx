import React from 'react'

import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import LocalStorage from './models/local-storage.js'

import Auth from './components/auth.jsx'
import AuthCallback from './components/auth-callback.jsx'
import NotFound from './components/not-found.jsx'
import Spotify from './components/spotify.jsx'

function App(props) {
  return <div>{props.children}</div>
}

function requireSpotifyAuth(nextState, replace) {
  if (!LocalStorage.has('spotify-token')) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Auth} />
      <Route path="auth" component={AuthCallback} />
      <Route
        path="spotify"
        component={Spotify}
        onEnter={requireSpotifyAuth}
      />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)

export default routes
