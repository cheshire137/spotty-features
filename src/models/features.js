class Features {
}

Features.fields = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'valence', // Positivity
  'speechiness'
]

Features.colors = {
  acousticness: '#FF7EAB',
  danceability: '#0ABD9C',
  energy: '#e3b951',
  instrumentalness: '#494949',
  liveness: '#AF33C8',
  negativity: '#004DD0',
  valence: '#90B207', // Positivity
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
