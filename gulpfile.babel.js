'use strict';
import babel from 'gulp-babel';
import babelCompiler from 'babel';
import del from 'del';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import istanbul from 'gulp-istanbul';
import jscs from 'gulp-jscs';
import mocha from 'gulp-mocha';

const configFiles = 'gulpfile.babel.js'
  , destDir = 'generators/'
  , srcFiles = 'lib/*/*.js'
  , testFiles = 'test/*.js';

gulp.task('clean', () => del(destDir));

gulp.task('lint', () => {
  return gulp.src([configFiles, srcFiles, testFiles])
    .pipe(eslint())
    .pipe(eslint.formatEach('./node_modules/eslint-path-formatter'))
    .pipe(eslint.failOnError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('compile', ['clean', 'lint'], () => {
  return gulp.src(srcFiles, {base: './lib'})
    .pipe(babel({
      auxiliaryCommentBefore: 'istanbul ignore next',
      modules: 'common',
      optional: ['runtime']
    }))
    .pipe(gulp.dest(destDir));
});

gulp.task('copy:templates', ['clean'], () => {
  return gulp.src(['lib/*/templates/**/*', 'lib/*/templates/.*'])
    .pipe(gulp.dest(destDir));
});

gulp.task('build', ['compile', 'copy:templates']);

gulp.task('test', ['build'], cb => {
  gulp.src([destDir + '*/*.js', '!' + testFiles])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src([testFiles])
        .pipe(mocha({
          compilers: {
            js: babelCompiler
          }
        }))
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});
