'use strict'

import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import del from 'del'
import mkdirp from 'mkdirp'
import seq from 'run-sequence'

const DEST = 'lib'

const $ = loadPlugins()

const plumb = () => $.plumber({
  errorHandler: $.notify.onError('<%= error.message %>')
})

gulp.task('clean', () => del.sync(DEST))

gulp.task('build', () => {
  mkdirp.sync(DEST)
  return gulp.src('src/**/*.js')
    .pipe(plumb())
    .pipe($.babel())
    .pipe(gulp.dest(DEST))
})

gulp.task('cleanbuild', cb => seq('clean', 'build', cb))

gulp.task('watch', () => gulp.watch('src/**/*', ['cleanbuild']))

gulp.task('default', ['cleanbuild'], () => gulp.start('watch'))
