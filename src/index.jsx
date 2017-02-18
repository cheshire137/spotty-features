import Promise from 'promise-polyfill'
import ReactDOM from 'react-dom'

import routes from './routes.jsx'

if (!window.Promise) {
  window.Promise = Promise
}

ReactDOM.render(routes, document.getElementById('root'))
