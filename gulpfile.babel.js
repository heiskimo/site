import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import hash from 'gulp-hash';
import del from 'del';
import {spawn} from 'child_process';
import hugoBin from 'hugo-bin';
import BrowserSync from 'browser-sync';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ['-d', '../dist', '-s', 'site', '-v'];
const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];

const themeName = 'shop';
const themeFolder = 'site/themes/' + themeName;

const scssFiles = themeFolder + '/src/scss/**/*.scss',
  cssDest = themeFolder + '/static/css';

const jsFiles = themeFolder + '/src/js/**/*.js',
  jsDest = themeFolder + '/static/js';

const vendorsFiles = themeFolder + '/src/vendors/**/*',
  vendorsDest = themeFolder + '/static/vendors';

// Development tasks
gulp.task('hugo', (cb) => buildSite(cb));
gulp.task('hugo-preview', (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task('server', ['hugo', 'vendors', 'scss', 'js'], (cb) => runServer(cb));
gulp.task('server-preview', ['hugo-preview', 'vendors', 'scss', 'js'], (cb) => runServer(cb));

// Build/production tasks
gulp.task('build', ['vendors', 'scss', 'js'], (cb) => buildSite(cb, [], 'production'));
gulp.task('build-preview', ['vendors', 'scss', 'js'], (cb) => buildSite(cb, hugoArgsPreview, 'production'));

// Compile SCSS files to CSS
gulp.task('scss', function() {
  //Delete our old css files
  // del(['dist/**/*.css']);
  // del([cssDest + '**/*.css']);

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
    // .pipe(hash())
    .pipe(gulp.dest(cssDest))
  //Create a hash map
    // .pipe(hash.manifest('hash.json'))
  //Put the map in the data directory
    // .pipe(gulp.dest('site/data/css'));
});

// Minify JS
gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(concat(themeName + '.js'))
    .pipe(rename(themeName + '.min.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify().on('error', function(e) {
      console.log(e);
    }))
    .pipe(gulp.dest(jsDest));
});

// Vendors
gulp.task('vendors', function() {
  return gulp.src([vendorsFiles])
    .pipe(gulp.dest(vendorsDest));
});

// Watch asset folder for changes
// gulp.task('watch', ['scss', 'js'], function() {
//   gulp.watch(scssFiles, ['scss']);
//   gulp.watch(jsFiles, ['js']);
// });


// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(vendorsFiles, ['vendors']);
  gulp.watch(scssFiles, ['scss']);
  gulp.watch(jsFiles, ['js']);
  gulp.watch('./site/**/*', ['hugo']);
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = 'development') {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: 'inherit'}).on('close', (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify('Hugo build failed :(');
      cb('Hugo build failed');
    }
  });
}
