'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var order = require("gulp-order");
var jshint = require('gulp-jshint');
var cleanCSS = require('gulp-clean-css');


// release structure
// app_v.js
// app_v.css

// app.feed_v.js
// app.feed_v.css

// libs.js
// libs.css
// img

gulp.task('jshint', function () {
	gulp.src(['./app/**/*.js'])
	  	.pipe(jshint())
	    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
	      filename: __dirname + '/jshint-output.html',
	      createMissingFolders : false  
	    }));
});

gulp.task('build_libs_js', function(){

	var libsJS = ['node_modules/angular/angular.min.js',
				'node_modules/angular-resource/angular-resource.min.js',
				'node_modules/angular-animate/angular-animate.min.js',
				'node_modules/angular-messages/angular-messages.min.js',
				'node_modules/angular-aria/angular-aria.min.js',
				'node_modules/angular-material/angular-material.min.js',
				'node_modules/angular-material-icons/angular-material-icons.min.js',
				'node_modules/angular-ui-router/release/angular-ui-router.min.js',
				'node_modules/lodash/lodash.min.js',
				'node_modules/moment/min/moment.min.js'];

    return gulp.src(libsJS)
        .pipe(concat('libs.js'))
        //.pipe(gulp.dest('./'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});
gulp.task('build_app_js', function(){

	var appJS = ['./app/**/*.js'];
    return gulp.src(appJS)
    	.pipe(order([
		    'index.module.js',
		    'index.config.js',
		    'index.constants.js',
		    'index.run.js',
		    'index.route.js'
	  	]))
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./'));
});

gulp.task('build_libs_css', function(){

	var libsCSS = ['node_modules/angular-material/angular-material.css',
				'node_modules/angular-material-icons/angular-material-icons.css',
				'node_modules/font-awesome/css/font-awesome.min.css'];

    return gulp.src(libsCSS)
        .pipe(concat('libs.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./'));
});
gulp.task('build_app_css', function(){

	var libsCSS = ['./app/**/*.scss'];

	return gulp.src(libsCSS)
    	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    	.pipe(concat('app.css'))
    	.pipe(cleanCSS())
    	.pipe(gulp.dest('./'));
});

gulp.task('release_clean', function() {
	rimraf('/node_modules');
	rimraf('/app');
});

gulp.task('release', 
	['clean', 
	'build_libs_js', 
	'build_app_js', 
	'build_libs_css', 
	'build_app_css'
	]);

gulp.task('styles', function () {
  return gulp.src('./app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});

gulp.task('index', function () {
  var target = gulp.src('./index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./app/**/*.js', './styles/**/*.css'], {read: false});
 
  return target.pipe(inject(sources)).pipe(gulp.dest('./'));;
});

gulp.task('build', ['styles', 'index']);

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', function () {
  gulp.start('build');
});
