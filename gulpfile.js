var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jst = require('gulp-template-compile'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),
    server = require('gulp-webserver'),
    del = require('del'),
    sequence = require('run-sequence'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip');

var config = {
  version: "1.0.0"
};

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('lib', function() {
  return gulp.src('lib/**')
    .pipe(gulp.dest('dist/assets/lib'));
});

gulp.task('scripts', function() {
  return gulp.src('src/main/app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(rename({ suffix: '-'}))
    .pipe(rename({ suffix: config.version}))
    .pipe(gulp.dest('dist/assets/app/js'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/app/js'));
});

gulp.task('templates', function() {
  return gulp.src('src/main/app/templates/**/*.html')
    .pipe(jst({
       namespace: 'IssueTrackerTemplates',
       name: function(file) { return file.relative.replace(/\.html$/,''); }
     }))
    .pipe(concat('app-templates.js'))
    .pipe(rename({ suffix: '-'}))
    .pipe(rename({ suffix: config.version}))
    .pipe(gulp.dest('dist/assets/app/js'));
});

gulp.task('html', function() {
  return gulp.src('src/main/app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src('src/main/app/css/**/*.css')
    .pipe(gulp.dest('dist/assets/app/css'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/app/css'));
});

gulp.task('tar', function() {
  return gulp.src('dist/**')
    .pipe(tar('issuetracker.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('lib', 'templates', 'scripts', 'html', 'css');
});

gulp.task('dist', ['clean'], function() {
  sequence(['lib', 'templates', 'scripts', 'html', 'css'], 'tar');
});

gulp.task('run', ['lib', 'templates', 'scripts', 'html', 'css'], function() {
  gulp.watch('src/main/app/templates/**/*.html', ['templates']);
  gulp.watch('src/main/app/js/**/*.js', ['scripts']);
  gulp.watch('src/main/app/*.html', ['html']);
  gulp.watch('src/main/app/css/**/*.css', ['css']);
  gulp.watch('lib/**', ['lib']);

  gulp.src('dist')
    .pipe(server({
      port: 9000,
      livereload: true
    }));
});
