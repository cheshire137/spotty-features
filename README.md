# Spotty Features

Show trends about your music listening habits over time using different audio
features like acousticness, danceability, and energy, based on the tracks you
save to your Spotify library.

## How to Develop

You will need [Homebrew](http://brew.sh/) installed in macOS.

Create
[a Spotify application](https://developer.spotify.com/my-applications) and copy
your app's client ID to src/public/config.json. Add `http://localhost:3000/auth`
as a redirect URI in your Spotify app.

```bash
brew update
brew install yarn
yarn install
gulp
open http://localhost:3000
```
