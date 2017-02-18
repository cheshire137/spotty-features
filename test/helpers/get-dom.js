import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

function getDOM(component) {
  const result = TestUtils.renderIntoDocument(component)
  return ReactDOM.findDOMNode(result)
}

export default getDOM
