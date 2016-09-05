var gulp        = require('gulp');
//var sass        = require('gulp-sass');
var sass = require('gulp-ruby-sass');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

var gulpif = require('gulp-if');

var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
//var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

// Registering a 'less' task that just compile our LESS files to CSS


gulp.task('sass', function () {
  return sass('frontend/scss/*.scss')
      .on('error', sass.logError)
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('app', function() {
  gulp.src('frontend/app/main.msx')
      .pipe(browserify({
        transform: ['mithrilify']
      }))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('public/javascripts/'))
});


//
gulp.task('serve', function () {
  browserSync({
    // By default, Play is listening on port 9000
    proxy: 'localhost:9000',
    // We will set BrowserSync on the port 9001
    port: 9001,
    // Reload all assets
    // Important: you need to specify the path on your source code
    // not the path on the url
    files: ['public/stylesheets/*.css',
      'public/javascripts/*.js',
      'app/views/{,*/}*.html',
      'app/views/{,*/}{,*/}*.html',
      'app/views/{,*/}/{,*/}{,*/}*.html',
      'app/views/{,*/}*.stream',
      'app/controllers/{,*/}*.scala',
      'conf/routes',
    ],
    open: false
  });
});

gulp.task('watcher', ['app'], function () {
  gulp.watch('frontend/app/{,*/}{,*/}{,*/}{,*/}*.msx', ['app']);
  gulp.watch('frontend/app/{,*/}{,*/}{,*/}{,*/}*.js', ['app']);
  gulp.watch('frontend/scss/{,*/}*.scss', ['sass']);
});



// Creating the default gulp task
gulp.task('default', [ 'sass', 'app', 'watcher', 'serve']);
