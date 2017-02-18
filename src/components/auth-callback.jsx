import React from 'react'
import { withRouter } from 'react-router'

import LocalStorage from '../models/local-storage'

class AuthCallback extends React.Component {
  componentWillMount() {
    const hash = this.props.location.hash
    const parts = hash.split('&')
    const prefix = 'access_token='
    const tokenPart = parts.filter(str => str.indexOf(prefix))[0]
    const index = tokenPart.indexOf(prefix)
    const token = tokenPart.slice(index + prefix.length)
    LocalStorage.set('spotify-token', token)
    this.props.router.push('/spotify')
  }

  render() {
    return <p>Signing you in...</p>
  }
}

export default withRouter(AuthCallback)
