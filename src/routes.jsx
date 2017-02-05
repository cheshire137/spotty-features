import React from 'react'

import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import Auth from './components/auth.jsx'
import AuthCallback from './components/auth-callback.jsx'
import NotFound from './components/not-found.jsx'
import Spotify from './components/spotify.jsx'

function App(props) {
  return <div>{props.children}</div>
}

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Auth} />
      <Route path="auth" component={AuthCallback} />
      <Route path="spotify" component={Spotify} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)

export default routes
