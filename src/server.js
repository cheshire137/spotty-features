const path = require('path')
const express = require('express')

const app = express()

app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(app.get('port'), () => {
  console.log(`spotty-features listening on port ${app.get('port')}`)
})
