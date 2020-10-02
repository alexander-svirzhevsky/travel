'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const groupMediaQueries = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-cleancss');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const imagemin = require('gulp-imagemin');


const paths = {
  src: './src/',              // paths.src
  build: './build/'           // paths.build
};

function styles() {
  return gulp.src(paths.src + 'scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass()) // { outputStyle: 'compressed' }   компилируем sass
    .pipe(groupMediaQueries())
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 version'] }),
    ]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(paths.build + 'css/'));
}

function svgSprite() {
  return gulp.src(paths.src + 'imgg/*.svg')
    .pipe(svgmin(function (file) {
      return {
        plugins: [{
          cleanupIDs: {
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite1.svg'))
    .pipe(gulp.dest(paths.build + 'img/'));
}

function scripts() {
  return gulp.src(paths.src + 'js/modules/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['env']         // поддержка старых версий браузеров
    }))
    .pipe(uglify())            // сжимаем
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(paths.build + 'js/'))
}

function scripts_2() {
  return gulp.src(paths.src + 'js/section/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['env']         // поддержка старых версий браузеров
    }))
    .pipe(uglify())            // сжимаем
    .pipe(concat('script_2.min.js'))
    .pipe(gulp.dest(paths.build + 'js/'))
}

function scriptsVendors() {
  return gulp.src([
    'node_modules/isotope-layout/**/*',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/slick-carousel/slick/slick.min.js',
    'node_modules/svg4everybody/dist/svg4everybody.min.js'
  ])
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest(paths.build + 'js/'))
}

function htmls() {
  return gulp.src(paths.src + '*.html')
    .pipe(plumber())
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
    .pipe(gulp.dest(paths.build));
}

function fonts() {
  return gulp.src(paths.src + 'fonts/*')
    .pipe(plumber())
    .pipe(gulp.dest(paths.build + 'fonts/'));
}

function images() {
  return gulp.src(paths.src + 'img/**/*.{jpg,jpeg,png,gif}')
    .pipe(imagemin()) // если картинок будет много, то и времени будет уходить много
    .pipe(gulp.dest(paths.build + 'img/'));
}

function sprite() {
  return gulp.src(paths.src + 'img/*.svg')
    // .pipe(plumber())
    .pipe(gulp.dest(paths.build + 'img/'));
}

function video() {
  return gulp.src(paths.src + 'video/**')
    // .pipe(plumber())
    .pipe(gulp.dest(paths.build + 'video/'));
}

function clean() {
  return del('build/')
}

function watch() {
  gulp.watch(paths.src + 'scss/**/*.scss', styles);
  gulp.watch(paths.src + 'js/**/*.js', scripts);
  gulp.watch(paths.src + 'js/**/*.js', scripts_2);
  gulp.watch(paths.src + '*.html', htmls);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  browserSync.watch(paths.build + '**/**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.scriptsVendors = scriptsVendors;
exports.htmls = htmls;
exports.images = images;
exports.svgSprite = svgSprite;
exports.clean = clean;
exports.watch = watch;
exports.fonts = fonts;
exports.sprite = sprite;
exports.scripts_2 = scripts_2;
exports.video = video;

gulp.task('build', gulp.series(
  clean,
  gulp.parallel(styles, scripts, scripts_2, svgSprite, scriptsVendors, htmls, images, fonts, sprite, video)
));

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(styles, scripts, scripts_2, svgSprite, scriptsVendors, htmls, images, fonts, sprite, video),
  gulp.parallel(watch, serve)
));
