var gulp = require('gulp'),
	concat = require('gulp-concat'),
	csso = require('gulp-csso'),
	uglify = require('gulp-uglify'),
	saveLicense = require('uglify-save-license'),
	fs = require('fs'),
	json = JSON.parse(fs.readFileSync('./package.json'));

gulp.task('css', function() {
	return gulp.src('jquery.appendGrid-development.css')
		.pipe(csso())
		.pipe(concat('jquery.appendGrid-' + json.version + '.min.css'))
		.pipe(gulp.dest('./'));
});

gulp.task('js', function (cb) {
	return gulp.src('jquery.appendGrid-development.js')
		.pipe(uglify({
            output: {
                comments: saveLicense
            }
        }))
		.pipe(concat('jquery.appendGrid-' + json.version + '.min.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('default', [ 'css', 'js' ]);