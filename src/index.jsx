import ReactDOM from 'react-dom'
import routes from './routes.jsx'

import Promise from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = Promise
}

ReactDOM.render(routes, document.getElementById('root'))
