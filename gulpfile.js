var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var nodemon = require('gulp-nodemon')

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')

var browserify = require('browserify')
var watchify = require('watchify')

function compile(watch) {
  var bundler = watchify(
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

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...')
      rebundle()
    })
  }

  rebundle()
}

function watch() {
  return compile(true)
}

gulp.task('build', function() { return compile() })
gulp.task('watch', function() { return watch() })

gulp.task('serve', function() {
  nodemon({ script: 'src/server.js', ignore: 'src/public/bundle.js' })
})

gulp.task('default', ['watch', 'serve'])
