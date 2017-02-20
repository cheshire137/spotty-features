let timer = null

function waitForRequests(mockedRequests, done, fail, callback) {
  const wait = new Promise(resolve => {
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

  wait.then(() => {
    try {
      callback()
      if (done) {
        done()
      }
    } catch (error) {
      fail(error)
    }
  })
}

export default waitForRequests
