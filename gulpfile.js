var gulp = require('gulp');
var gulp_jspm = require('gulp-jspm'); // npm install gulp-jspm 

gulp.task('deploy', function() {    
    var dir = '../monagames.github.io/spacemonas/';

    gulp.src('src/main.js').pipe(gulp_jspm())
        .pipe(gulp.dest(dir));

    gulp.src(['./assets/**/*.{mp3,png,css,wav,woff,woff2}'])
        .pipe(gulp.dest(dir + 'assets'));
});