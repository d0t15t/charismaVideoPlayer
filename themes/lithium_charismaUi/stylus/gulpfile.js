var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var nib = require('nib');
var rupture = require('rupture');

gulp.task('stylus', function() {
  return gulp.src('src/stylus/index.styl')
    .pipe(stylus({
      use: [
        nib(),
        rupture()
      ],
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(gulp.dest('../static/css/')); // Copy files to hugo.
});

gulp.task('build', ['stylus']);

gulp.task('watch', ['build'], function () {
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
});

gulp.task('default', ['watch']);
