let timer = null

function waitForRequests(mockedRequests, done, callback) {
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
      done()
    } catch (error) {
      done.fail(error)
    }
  })
}

export default waitForRequests
