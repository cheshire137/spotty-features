const path = require('path')
const express = require('express')

const app = module.exports = express()

app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`spotty-features listening on port ${app.get('port')}`)
  })
}
