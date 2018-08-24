const themeName = 'shop';
const themeFolder = 'site/themes/' + themeName;

const scssFiles = themeFolder + '/src/scss/**/*.scss',
	cssDest = themeFolder + '/static/css';

const jsFiles = themeFolder + '/src/js/**/*.js',
	jsDest = themeFolder + '/static/js';


const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const hash = require("gulp-hash");
const del = require("del");



// Compile SCSS files to CSS
gulp.task('scss', function () {
	//Delete our old css files
	del([cssDest + '**/*.css'])

	gulp.src(scssFiles)
	.pipe(sass({
		includePaths: ['node_modules']
	}))
	.pipe(sass({
		outputStyle : 'compressed'
	}))
	.pipe(autoprefixer({
		browsers : ['last 20 versions']
	}))
	.pipe(rename(themeName + '.min.css'))
	.pipe(hash())
	.pipe(gulp.dest(cssDest))
	//Create a hash map
	.pipe(hash.manifest('hash.json'))
	//Put the map in the data directory
	.pipe(gulp.dest('site/data/css'));
});

// Minify JS
gulp.task('js', function() {
	return gulp.src(jsFiles)
	.pipe(concat(themeName + '.js'))
	.pipe(rename(themeName + '.min.js'))
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(uglify().on('error', function(e){
		console.log(e);
	}))
	.pipe(gulp.dest(jsDest));
});

// Watch asset folder for changes
gulp.task('watch', ['scss', 'js'], function () {
	gulp.watch(scssFiles, ['scss']);
	gulp.watch(jsFiles, ['js']);
});

// Set watch as default task
gulp.task('default', ['watch']);
