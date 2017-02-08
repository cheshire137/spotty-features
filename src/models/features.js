class Features {
}

Features.fields = ['acousticness', 'danceability', 'energy', 'valence',
                   'instrumentalness', 'liveness', 'speechiness']

Features.colors = {
  acousticness: '#FF7EAB',
  danceability: '#0ABD9C',
  energy: '#e3b951',
  valence: '#90B207',
  negativity: '#004DD0',
  instrumentalness: '#494949',
  liveness: '#AF33C8',
  speechiness: '#f09945'
}

Features.labels = {
  acousticness: 'Acoustic',
  danceability: 'Danceable',
  energy: 'Energetic',
  valence: 'Positivity',
  negativity: 'Negativity',
  instrumentalness: 'Instrumental',
  liveness: 'Live',
  speechiness: 'Speechy'
}

export default Features
