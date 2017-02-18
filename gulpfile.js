const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const nodemon = require('gulp-nodemon')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const browserify = require('browserify')
const watchify = require('watchify')

function compile(watch) {
  const bundler = watchify(
    browserify('./src/index.jsx', { debug: true }).
    transform('babelify', { presets: ['es2015', 'react'] })
  )

  function rebundle() {
    bundler.bundle().on('error', function(err) {
      console.error(err)
      this.emit('end')
    }).pipe(source('bundle.js')).
       pipe(buffer()).
       pipe(sourcemaps.init({ loadMaps: true })).
       pipe(sourcemaps.write('./')).
       pipe(gulp.dest('./src/public'))
  }

  function onUpdate() {
    const date = new Date()
    let hours = date.getHours()
    if (hours < 10) {
      hours = `0${hours}`
    }
    let minutes = date.getMinutes()
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let seconds = date.getSeconds()
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    const timestamp = `${hours}:${minutes}:${seconds}`
    console.log(`[${timestamp}] bundling...`)
    rebundle()
  }

  if (watch) {
    bundler.on('update', onUpdate)
  }

  rebundle()
}

function watch() {
  return compile(true)
}

function build() {
  return compile()
}

function serve() {
  nodemon({ script: 'src/server.js', ignore: 'src/public/bundle.js' })
}

gulp.task('build', build)
gulp.task('watch', watch)
gulp.task('serve', serve)
gulp.task('default', ['watch', 'serve'])
