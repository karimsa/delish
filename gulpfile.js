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
    , babel = require('gulp-babel')
    , eslint = require('gulp-eslint')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , buffer = require('vinyl-buffer')
    , postcss = require('gulp-postcss')
    , browserify = require('browserify')
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

gulp.task('lint', ['lint:browser', 'lint:node'])

gulp.task('js', ['lint'], () =>
  browserify(BROWSER_JS_FILES.map(a => glob.sync(a)))
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/dist/js'))
)

gulp.task('css', () =>
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

gulp.task('default', ['css', 'js'])

gulp.task('watch', () => {
    gulp.watch(JS_FILES.concat([ 'public/src/js/**/*.json' ]), ['js'])
    gulp.watch(CSS_FILES, ['css'])
})