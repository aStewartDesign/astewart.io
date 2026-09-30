/**
 * DEPENDENCIES
 */

// Utilities
import path from "node:path";
import fs from "fs";
import { deleteAsync as del } from "del";
import gulp from "gulp";
import { nunjucksCompile } from "gulp-nunjucks";
import ext from "gulp-ext-replace";
import BrowserSync from "browser-sync";
const browserSync = BrowserSync.create();

// CSS
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import GulpSass from "gulp-sass";
import * as SassCompiler from "sass";
const sass = GulpSass(SassCompiler);

// Javascript
import context from "./context.json" with { type: "json" };

/**
 * CONFIGURATION
 */

const dirname = path.dirname(new URL(import.meta.url).pathname);

const paths = {
  build: path.resolve(dirname, "www"),
  dest: path.resolve(dirname, "public"),
  src: path.resolve(dirname, "src"),
};

const postcssProcessors = [autoprefixer, cssnano];

/**
 * TASKS
 */

/** Build static site  */
function build() {
  const addTimeToDateString = (dateString) => `${dateString}T00:00:00`;
  const experienceStart = addTimeToDateString("2011-06-01");
  context.utils = {
    getExperienceTypeIcon: (type) => {
      const base = "fas fa-";
      switch (type) {
        case "education":
          return `${base}university`;

        case "client":
          return `${base}file-contract`;

        case "job":
          return `${base}briefcase`;

        case "certification":
          return `${base}address-card`;

        default:
          return `${base}hard-hat`;
      }
    },
    getExperienceLabel: (type) => {
      switch (type) {
        case "education":
          return "Education";

        case "client":
          return "Contract Work";

        case "job":
          return "Full-Time Job";

        case "certification":
          return "Certification";

        default:
          return "Other";
      }
    },
    getLevelIcon: (level, skillLevel) => {
      if (level > skillLevel) {
        return "far fa-circle u-color-neutral";
      } else {
        return "fas fa-circle u-color-primary";
      }
    },
    getDate: (date) => {
      const dateObj = new Date(addTimeToDateString(date));
      return dateObj.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    },
  };
  const experienceStartDate = new Date(experienceStart);
  const currentDate = new Date();
  context.yearsExperience =
    currentDate.getFullYear() - experienceStartDate.getFullYear();
  return gulp
    .src(path.resolve(paths.src, "*.njk"))
    .pipe(nunjucksCompile(context))
    .pipe(ext(".html"))
    .pipe(gulp.dest(path.resolve(paths.dest)));
}

/** Serve dynamic site */
function serve(done) {
  browserSync.init({
    server: {
      baseDir: paths.dest,
    },
  });

  gulp
    .watch(
      [
        path.resolve(paths.src, "**/*.scss"),
        path.resolve(paths.src, "**/*.njk"),
      ],
      gulp.parallel(build, styles),
    )
    .on("change", browserSync.reload)
    .on("ready", done);
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
  return gulp
    .src(path.resolve(paths.src, "styles/main.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(postcssProcessors))
    .pipe(gulp.dest(path.resolve(paths.dest, "styles")));
}

/** Copy image assets */
function images() {
  return gulp
    .src(path.resolve(paths.src, "images/**/*"), {
      encoding: false,
    })
    .pipe(gulp.dest(path.join(paths.dest, "images")));
}

/**
 * TASK SETS
 */

const compile = gulp.series(clean, gulp.parallel(build, images, styles));

/**
 * TASK DEFINITIONS
 */

// gulp.task('start', gulp.series(compile, serve));
gulp.task("build", compile);
gulp.task("start", gulp.series(compile, serve));
