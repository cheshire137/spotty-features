const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const nodemon = require('gulp-nodemon')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const browserify = require('browserify')
const watchify = require('watchify')

function getTimeSegment(date, funcName) {
  const timeSegment = date[funcName]()
  if (timeSegment < 10) {
    return `0${timeSegment}`
  }
  return timeSegment
}

function getTimestamp() {
  const date = new Date()
  const hours = getTimeSegment(date, 'getHours')
  const minutes = getTimeSegment(date, 'getMinutes')
  const seconds = getTimeSegment(date, 'getSeconds')
  return `${hours}:${minutes}:${seconds}`
}

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
       pipe(gulp.dest('./src/public')).
       on('end', () => {
         console.log(`[${getTimestamp()}] done!`)
       })
  }

  function onUpdate() {
    console.log(`[${getTimestamp()}] bundling...`)
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
