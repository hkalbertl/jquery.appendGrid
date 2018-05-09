// Load required modules
var gulp = require('gulp'),
    copy = require('gulp-copy'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    saveLicense = require('uglify-save-license'),
    del = require('del');

// Clean the dist folder
gulp.task('clean', function () {
    return del(['dist/**/*']);
});

// CSS for Bootstrap 4
gulp.task('css_bs4', ['clean'], function () {
    return gulp.src(['src/css/ag.core.js', 'src/css/ag.bootstrap4.css'])
        .pipe(concat('jquery.appendGrid-bs4.css'))
        .pipe(gulp.dest('dist'));
});

// CSS minify
gulp.task('csso', ['css_bs4'], function () {
    return gulp.src('dist/*.css')
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

// JS for Bootstrap 4 + Font Awesome 5
gulp.task('js_bs4_fa5', ['clean'], function (cb) {
    return gulp.src(['src/js/ag.core.js', 'src/js/ag.bootstrap4.js', 'src/js/ag.bootstrap4_fontawesome5.js'])
        .pipe(concat('jquery.appendGrid-bs4_fa5.js'))
        .pipe(gulp.dest('dist'));
});

// JS for Bootstrap 4 + Octicons 4
gulp.task('js_bs4_oi4', ['clean'], function (cb) {
    return gulp.src(['src/js/ag.core.js', 'src/js/ag.bootstrap4.js', 'src/js/ag.bootstrap4_octicons4.js'])
        .pipe(concat('jquery.appendGrid-bs4_oi4.js'))
        .pipe(gulp.dest('dist'));
});

// JS minify
gulp.task('uglify', ['js_bs4_fa5', 'js_bs4_oi4'], function (cb) {
    return gulp.src('dist/*.js')
        .pipe(uglify({
            output: {
                comments: saveLicense
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

// Copy the bs4_fa5 output as main files
gulp.task('copy_main', ['uglify', 'csso'], function () {
    return gulp.src(['dist/jquery.appendGrid-bs4_fa5.js', 'dist/jquery.appendGrid-bs4.css'])
        .pipe(rename(function (path) {
            path.basename = "jquery.appendGrid";
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('copy_main_min', ['uglify', 'csso'], function () {
    return gulp.src(['dist/jquery.appendGrid-bs4_fa5.min.js', 'dist/jquery.appendGrid-bs4.min.css'])
        .pipe(rename(function (path) {
            path.basename = "jquery.appendGrid.min";
        }))
        .pipe(gulp.dest('dist'));
});


// The main task
gulp.task('default', ['clean', 'css_bs4', 'csso', 'js_bs4_fa5', 'js_bs4_oi4', 'uglify', 'copy_main', 'copy_main_min']);
