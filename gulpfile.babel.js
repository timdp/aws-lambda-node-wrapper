'use strict'

import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import del from 'del'
import mkdirp from 'mkdirp'
import seq from 'run-sequence'

const FUNCTION = 'node-wrapper'
const AWS_OPTIONS = {
  profile: 'default',
  region: 'eu-west-1'
}

const DEST = 'lib'
const TMP = '.tmp'
const ZIP = 'archive.zip'

const $ = loadPlugins()

const plumb = () => $.plumber({
  errorHandler: $.notify.onError('<%= error.message %>')
})

gulp.task('clean', () => del.sync([DEST, TMP]))

gulp.task('build', () => {
  mkdirp.sync(DEST)
  return gulp.src('src/**/*.js')
    .pipe(plumb())
    .pipe($.babel())
    .pipe(gulp.dest(DEST))
})

gulp.task('cleanbuild', cb => seq('clean', 'build', cb))

gulp.task('deploy', ['cleanbuild'], () => {
  const files = [
    'index.js',
    'lib/**/*.js',
    'vendor/**/*',
    'node_modules/{core-js,babel-runtime}/**/*'
  ]
  return gulp.src(files, {base: '.'})
    .pipe($.zip(ZIP))
    .pipe($.awslambda(FUNCTION, AWS_OPTIONS))
    .pipe(gulp.dest(TMP))
})

gulp.task('watch', () => gulp.watch('src/**/*', ['cleanbuild']))

gulp.task('default', ['cleanbuild'], () => gulp.start('watch'))
