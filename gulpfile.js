'use strict';

// Load plugins
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cp = require('child_process');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const combineMediaQuery = require('postcss-combine-media-query');
const mediaQueriesSplitter = require('gulp-media-queries-splitter');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        open: false,
        //proxy: 'http://hummingbird.chandresh.php/', // replace it with yours
        port: 3000,
        server: {
            baseDir: './'
        }
    });
    done();
}
// html
function html() {
    return gulp
        .src([
            './*.html',
        ])
        .pipe(browsersync.stream());
}
// clean
function clean() {
    return del(['./main']);
}

// imges
function images() {
    return gulp
        .src('./assets/src/image/**/*')
        .pipe(newer('./main'))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false,
                        collapseGroups: true
                    }]
                })
            ])
        )
        .pipe(gulp.dest('./main'));
}

// css
function css() {
    return gulp
        .src([
            './assets/src/scss/main.scss',
        ])
        .pipe(plumber())
        .pipe(concat('wps-d-style.css'))
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./main"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest("./main"))
        .pipe(postcss([autoprefixer(), combineMediaQuery()]))
        .pipe(gulp.dest("./main"))
        // .pipe(mediaQueriesSplitter([
        //     { media: 'none', filename: 'base.css' },
        //     { media: [{ min: '576px', minUntil: '768px' }, { min: '576px', max: '768px' }], filename: 'tablet.css' },
        //     { media: { min: '768px' }, filename: 'desktop.css' },
        // ]))
        // .pipe(gulp.dest("./assets/dist/css/"))
        // .pipe(rename({ suffix: ".min" }))
        // .pipe(postcss([cssnano()]))
        // .pipe(gulp.dest("./assets/dist/css/"))
        .pipe(browsersync.stream());
}

// scripts
function scripts() {
    return (
        gulp
        .src([
            './assets/src/js/**/*',
        ])
        .pipe(plumber())
        .pipe(concat('wps-d-script.js'))
        .pipe(gulp.dest('./main'))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./main'))
        .pipe(browsersync.stream())
    );
}

// fonts
function fonts() {
    return (
        gulp
        .src('./assets/src/fonts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('./main'))
        .pipe(browsersync.stream())
    );
}

// watch changes
function watchFiles() {
    gulp.watch('./assets/src/scss/**/*', css);
    gulp.watch('./assets/src/js/**/*', scripts);
    gulp.watch('./assets/src/image/**/*', images);
    gulp.watch('./assets/src/fonts/**/*', fonts);
}

const start = gulp.series(clean, images, fonts, css, scripts);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.scripts = scripts;
exports.clean = clean;
exports.watch = watch;
exports.default = gulp.series(start, watch);