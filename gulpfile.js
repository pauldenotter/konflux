var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	csslint = require('gulp-csslint'),
	files = {
		js: ['script/**/*.js'],
		css: ['style/**/*.css']
	};

gulp.task('jshint', function() {
	return gulp.src(files.js)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
	return gulp.src(files.css)
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('lint', ['jshint', 'csslint']);

gulp.task('watch', function() {
	gulp.watch(files.js, ['jshint']);
	gulp.watch(files.css, ['csslint']);
});

gulp.task('default', ['watch', 'lint']);
