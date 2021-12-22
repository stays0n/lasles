const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function fileinclude() {
  return src([
      'app/html/*.html'
    ])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: 'app/html/parts',
      context: {
        name: 'current',
        arr: [],
      }
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function styles() {
  return src([
      'node_modules/slick-slider/slick/slick.scss',
      // 'node_modules/owl.carousel/dist/assets/owl.carousel.css',
      'app/scss/style.scss',
    ])
    .pipe(scss({
      outputStyle: 'compressed'
    })) //compressed, expanded
    .pipe(concat('style.min.css')) // style.min.css, style.css
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true,
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/slick-slider/slick/slick.js',
      // 'node_modules/owl.carousel/dist/owl.carousel.js',
      'app/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function images() {
  return src([
      'app/images/**/*.*'
    ], {
      base: 'app'
    })
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: true
        }, {
          cleanupIDs: false
        }]
      })
    ]))
    .pipe(dest('dist'))
}

function build() {
  return src([
      'app/*.html',
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/fonts/*.*'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/html/**/*.html'], fileinclude);
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.fileinclude = fileinclude;
exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.default = parallel(fileinclude, styles, scripts, browsersync, watching); // >gulp (отключить слежение ctrl + c)

exports.cleanDist = cleanDist;
exports.images = images;
exports.build = series(cleanDist, images, build); // >gulp build