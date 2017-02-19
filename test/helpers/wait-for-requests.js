let timer = null

function waitForRequests(mockedRequests) {
  return new Promise(resolve => {
    if (mockedRequests.length < 1) {
      resolve()
      return
    }

    const allRequestsFinished = () => {
      const unfinishedRequests = mockedRequests.
        map(req => req.called()).filter(isCalled => !isCalled)
      return unfinishedRequests.length < 1
    }

    timer = setInterval(() => {
      if (allRequestsFinished()) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  })
}

export default waitForRequests
