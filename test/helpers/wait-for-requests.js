let timer = null

function waitForRequests(mockedRequests) {
  return new Promise(resolve => {
    if (mockedRequests.length < 1) {
      resolve()
      return
    }

    timer = setInterval(() => {
      const notYetCalled = mockedRequests.map(req => req.called()).
        filter(isCalled => !isCalled)
      if (notYetCalled.length < 1) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  })
}

export default waitForRequests
