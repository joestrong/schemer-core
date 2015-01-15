var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs');

gulp.task('default', ['build', 'watch']);

gulp.task('build', function(){
    gulp.src('./source/*.js')
        .pipe(concat('schemer.js'))
        .pipe(gulp.dest('./dist/'));
    gulp.src('./dist/schemer.js')
        .pipe(uglify('schemer.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
    gulp.watch('./source/*.js', ['build']);
});