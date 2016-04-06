/**
 * Created by pmomot on 3/29/16.
 */
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint');

/**
 * Build css and js (later) files
 * */
function buildAll () {
    gulp.src('public/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
}

gulp.task('build', buildAll); // TODO add concat and minify to js and css

// Watch task
gulp.task('default', function () {
    gulp.watch('public/scss/**/*.scss', ['styles']);
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['public/js/**/*.js', 'server/**/*.js', 'config.js', 'gulpfile.js', 'index.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

module.exports = buildAll;
