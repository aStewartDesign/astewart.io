/**
 * DEPENDENCIES
 */


// Utilities
const path = require('path');
const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const ext = require('gulp-ext-replace');
const browserSync = require('browser-sync').create();
const moment = require('moment');

// CSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Javascript
const context = require('./context.json');
// const rollup = require('./rollup.js');




/**
 * CONFIGURATION
 */

const paths = {
    build: path.resolve(__dirname, 'www'),
    dest: path.resolve(__dirname, 'public'),
    src: path.resolve(__dirname, 'src')
};

const postcssProcessors = [
    autoprefixer,
    cssnano
];





/**
 * TASKS
 */

/** Build static site  */
function build() {
    context.utils = {
        getExperienceTypeIcon: (type) => {
            const base = 'fas fa-';
            switch(type) {
                case 'education':
                    return `${base}university`;

                case 'client':
                    return `${base}file-contract`;

                case 'job':
                    return `${base}briefcase`;

                case 'certification':
                    return `${base}address-card`;

                default:
                    return `${base}hard-hat`;
            }
        },
        getLevelIcon: (level, skillLevel) => {
            if (level > skillLevel) {
                return 'far fa-circle u-color-neutral';
            }
            else {
                return 'fas fa-circle u-color-primary'
            }
        },
        getDate: (date) => moment(date).format('MMMM YYYY')
    };
    return gulp.src(path.resolve(paths.src, '*.njk'))
        .pipe(nunjucks.compile(context))
        .pipe(ext('.html'))
        .pipe(gulp.dest(path.resolve(paths.dest)));
}

/** Serve dynamic site */
function serve(done) {
    browserSync.init({
        server: {
            baseDir: paths.dest
        }
    });

    gulp.watch([
        path.resolve(paths.src, '**/*.scss'),
        path.resolve(paths.src, '**/*.njk')
    ], gulp.parallel(build, styles))
    .on('change', browserSync.reload)
    .on('ready', done);
}

/** Ensure build directories are present and clean the assets directory */
function clean() {
    if (!fs.existsSync(paths.dest)) {
        fs.mkdirSync(paths.dest);
    }
    if (!fs.existsSync(paths.build)) {
        fs.mkdirSync(paths.build);
    }
    return del(paths.dest);
}

/** Build css */
function styles() {
    return gulp.src(path.resolve(paths.src, 'styles/main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssProcessors))
        .pipe(gulp.dest(path.resolve(paths.dest, 'styles')));
}

/** Copy image assets */
function images() {
    return gulp.src(path.resolve(paths.src, 'images/**/*'))
        .pipe(gulp.dest(path.resolve(paths.dest, 'images')));
}



/**
* TASK SETS
*/

const compile = gulp.series(clean, gulp.parallel(build, images, styles));




/**
* TASK DEFINITIONS
*/

// gulp.task('start', gulp.series(compile, serve));
gulp.task('build', compile);
gulp.task('start', gulp.series(compile, serve));
