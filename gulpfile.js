/**
 * gulpfile.js
 *
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

const BROWSER_JS_FILES = [ 'public/src/js/*.js', 'public/src/js/**/*.js' ]
const NODE_JS_FILES = [ '*.js', '!gulpfile.js' ]
const JS_FILES = [].concat(BROWSER_JS_FILES, NODE_JS_FILES)
const CSS_FILES = [ 'public/src/css/mixins.pcss', 'public/src/css/*.pcss' ]

const gulp = require('gulp')
    , glob = require('glob')
    , eslint = require('gulp-eslint')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , buffer = require('vinyl-buffer')
    , postcss = require('gulp-postcss')
    , browserify = require('browserify')
    , imagemin = require('gulp-imagemin')
    , stylelint = require('gulp-stylelint')
    , source = require('vinyl-source-stream')
    , sourcemaps = require('gulp-sourcemaps')

gulp.task('lint:browser', () =>
  gulp.src(BROWSER_JS_FILES)
      .pipe(eslint({
        envs: ['browser']
      }))
      .pipe(eslint.formatEach())
      .pipe(eslint.failAfterError())
)

gulp.task('lint:node', () =>
  gulp.src(NODE_JS_FILES)
      .pipe(eslint({
        envs: ['node']
      }))
      .pipe(eslint.formatEach())
      .pipe(eslint.failAfterError())
)

gulp.task('lint:js', ['lint:browser', 'lint:node'])

gulp.task('build:js', () =>
  browserify({
    entries: 'public/src/js/setup.js',
    debug: true
  })
      .transform('babelify')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/dist/js'))
)

gulp.task('build:trackjs', () =>
  browserify({
    entries: 'public/src/js/track.js',
    debug: true
  })
      .transform('babelify')
      .bundle()
      .pipe(source('track.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/dist/js'))
)

gulp.task('js', ['lint:js', 'build:js', 'build:trackjs'])

gulp.task('lint:css', () =>
  gulp.src(CSS_FILES)
      .pipe(stylelint({
        failAfterError: true,
        reporters: [{
          formatter: 'string',
          console: true
        }]
      }))
)

gulp.task('css', ['lint:css'], () =>
  gulp.src(CSS_FILES)
      .pipe(sourcemaps.init())
      .pipe(postcss([
          require('precss')(),
          require('autoprefixer')({
              browsers: [ 'last 3 versions' ]
          }),
          require('cssnano')()
       ]))
       .pipe(concat('bundle.css'))
       .pipe(sourcemaps.write('.'))
       .pipe(gulp.dest('./public/dist/css'))
)

gulp.task('img', () =>
  gulp.src([ 'public/src/img/*', 'public/src/img/**/*' ])
      .pipe(imagemin())
      .pipe(gulp.dest('./public/dist/img'))
)

gulp.task('default', ['css', 'js', 'img'])

gulp.task('watch', () => {
    gulp.watch(JS_FILES.concat([ 'public/src/js/**/*.json' ]), ['js'])
    gulp.watch(CSS_FILES, ['css'])
})