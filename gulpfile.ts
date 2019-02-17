import del from "del";
import gulp from "gulp";
import mocha from "gulp-mocha";
import tslint from "gulp-tslint";
import ts from "gulp-typescript";
import { Configuration } from "webpack";
import webpack from "webpack-stream";

// tslint:disable-next-line:no-var-requires
const namedWithPath = require("vinyl-named-with-path");

const tsProject = ts.createProject("tsconfig.json");
const buildDir = "build";

gulp.task("lint", () => {
  return gulp.src("src/**/*.ts")
    .pipe(tslint({formatter: "verbose"}))
    .pipe(tslint.report({summarizeFailureOutput: true}));
});

gulp.task("build-scripts", () => {
  return gulp.src(["src/scripts/**/*.ts"])
    .pipe(namedWithPath())
    .pipe(webpack({config: require("./webpack.config.js")} as Configuration))
    .pipe(gulp.dest("build/scripts"));
});

gulp.task("build", gulp.series("build-scripts", () => {
  return gulp.src(["src/**/*.ts", "!src/scripts/**/*.ts"])
    .pipe(tsProject())
    .js.pipe(gulp.dest(buildDir));
}));

gulp.task("test-unit", () => {
  return gulp.src(["src/**/*.spec.ts", "src/**/*.test.ts"])
    .pipe(mocha({
      exit: true,
      reporter: "list",
      require: ["ts-node/register"],
      timeout: 5000,
    } as MochaSetupOptions));
});

gulp.task("test-features", () => {
  return gulp.src(["features/**/*.test.ts"])
    .pipe(mocha({
      exit: true,
      reporter: "list",
      require: ["ts-node/register"],
      timeout: 5000,
    } as MochaSetupOptions));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.ts", gulp.series(["lint", "build", "test"]));
});

gulp.task("default", gulp.series("watch"));

gulp.task("clean", () => {
  return del(buildDir);
});
