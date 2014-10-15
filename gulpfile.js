var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	csslint = require('gulp-csslint'),
	fiddlify = require('gulp-fiddlify'),
	files = {
		js: {src:['script/**/*.js']},
		css: {src:['style/**/*.css']},
		examples: {
			src: ['./examples/source/**/*.*'],
			dest: './examples/build'
		}
	};

gulp.task('jshint', function() {
	return gulp.src(files.js.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
	return gulp.src(files.css.src)
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('fiddlify', function() {
	return gulp.src(files.examples.src)
		.pipe(fiddlify())
		.pipe(gulp.dest(files.examples.dest));
});

gulp.task('lint', ['jshint', 'csslint']);

gulp.task('watch', function() {
	gulp.watch(files.js.src, ['jshint']);
	gulp.watch(files.css.src, ['csslint']);
	gulp.watch(files.examples.src, ['fiddlify']);
});

gulp.task('default', ['watch', 'lint', 'fiddlify']);
