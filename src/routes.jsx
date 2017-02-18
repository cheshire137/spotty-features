import React from 'react'

import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import LocalStorage from './models/local-storage'

import AnonLayout from './components/anon-layout.jsx'
import Auth from './components/auth.jsx'
import AuthCallback from './components/auth-callback.jsx'
import AuthLayout from './components/auth-layout.jsx'
import NotFound from './components/not-found.jsx'
import Spotify from './components/spotify.jsx'

function redirectIfSignedIn(nextState, replace) {
  if (LocalStorage.has('spotify-token')) {
    replace({
      pathname: '/spotify',
      state: { nextPathname: nextState.location.pathname }
    })
  }
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
    <Route path="/" component={AnonLayout}>
      <IndexRoute component={Auth} onEnter={redirectIfSignedIn} />
      <Route path="auth" component={AuthCallback} />
    </Route>
    <Route path="/spotify" component={AuthLayout} onEnter={requireSpotifyAuth}>
      <IndexRoute component={Spotify} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
)

export default routes
