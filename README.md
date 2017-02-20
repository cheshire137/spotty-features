# Spotty Features

[![Build Status](https://travis-ci.org/cheshire137/spotty-features.svg?branch=master)](https://travis-ci.org/cheshire137/spotty-features)

Show trends about your music listening habits over time using different audio
features like acousticness, danceability, and energy, based on the tracks you
save to your Spotify library. Also generate playlists like a given song or
artist, but with the specified audio features.

**[Try the app now](https://spotty-features.herokuapp.com)**

![Screenshot of trends](https://raw.githubusercontent.com/cheshire137/spotty-features/master/screenshot1.png)

![Screenshot of adjusting audio features](https://raw.githubusercontent.com/cheshire137/spotty-features/master/screenshot2.png)

![Screenshot of creating a playlist](https://raw.githubusercontent.com/cheshire137/spotty-features/master/screenshot3.png)

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

## How to Test

```bash
yarn install
yarn test
```

This will run the style checker and the Jest tests. You can run just the
style checker via `yarn run style`. You can run just the Jest tests
via `yarn run unit-test`.

Snapshots are used --
see [`test/components/__snapshots__/`](test/components/__snapshots__/) --
to test that a React component is rendered the same way consistently based
on the props it's given. If you update a component, a test may fail
because the snapshot is now different from what is rendered. Manually
compare the two and if the change is expected, update the now out-of-date
snapshot with `yarn run unit-test -- -u`.

See also:

- [Shallow rendering with Enzyme](http://airbnb.io/enzyme/docs/api/shallow.html)
- [Jest matchers](https://facebook.github.io/jest/docs/expect.html#content)
- [ESLint rules](http://eslint.org/docs/rules/)
- [XO style checker](https://github.com/sindresorhus/xo)

## How to Deploy to Heroku

In your Spotify application, you'll need to add your Heroku app's URL, with `/auth`,
as a valid redirect URI.

```bash
git push heroku master
```
