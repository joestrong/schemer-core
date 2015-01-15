var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs');

gulp.task('default', ['build', 'watch']);

gulp.task('build', function(){
    gulp.src('./source/*.js')
        .pipe(concat('gameengine.js'))
        .pipe(gulp.dest('./dist/'));
    gulp.src('./dist/gameengine.js')
        .pipe(uglify('gameengine.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
    gulp.watch('./source/*.js', ['build']);
});