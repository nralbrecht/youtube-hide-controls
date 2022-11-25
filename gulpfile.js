const { parallel, src, dest, series, watch } = require("gulp");
const del = require("del");
const zip = require("gulp-zip");
const rename = require("gulp-rename");
const mergeStream = require("merge-stream");
const jsonModify = require("gulp-json-modify");
const rollup = require("gulp-rollup");
const _7z = require("7zip-min");

const version = require("./package.json").version;
const baseSourceFolder = "src/";
const baseOutputFolder = "build";
const outputFolderFirefox = baseOutputFolder + "/firefox";
const outputFolderChrome = baseOutputFolder + "/chrome";

function cleanFirefox() {
    return del(outputFolderFirefox, {force: true});
}

function buildFirefox() {
    const singleFiles = src(baseSourceFolder + "manifest_firefox.json")
        .pipe(rename("manifest.json"))
        .pipe(jsonModify({
            key: "version",
            value: version
        }))
        .pipe(src(baseSourceFolder + "images/icon.svg"))
        .pipe(src(baseSourceFolder + "player.css"));

    const scripts = src(baseSourceFolder + "**/*.js")
        .pipe(rollup({
            input: [baseSourceFolder + "content-script.js", baseSourceFolder + "player.js", baseSourceFolder + "options/options.js"],
            output: {
                format: "esm"
            }
        }));

    const directories = src([baseSourceFolder + "options/**/*", baseSourceFolder + "_locales/**/*"], {base: "./src/"});

    return mergeStream(singleFiles, scripts, directories)
        .pipe(dest(outputFolderFirefox));
}

function packageFirefox() {
    return new Promise((resolve, reject) => {
        _7z.pack(`./${outputFolderFirefox}/*`, `${baseOutputFolder}/youtube-hide-controls_firefox_${version}.zip`, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

function cleanChrome() {
    return del(outputFolderChrome, {force: true});
}

function buildChrome() {
    const singleFiles = src(baseSourceFolder + "manifest_chrome.json")
        .pipe(rename("manifest.json"))
        .pipe(jsonModify({
            key: "version",
            value: version
        }))
        .pipe(src(baseSourceFolder + "images/icon_128.png"))
        .pipe(src(baseSourceFolder + "images/icon.svg"))
        .pipe(src(baseSourceFolder + "player.css"));

    const scripts = src(baseSourceFolder + "**/*.js")
        .pipe(rollup({
            input: [baseSourceFolder + "content-script.js", baseSourceFolder + "player.js", baseSourceFolder + "options/options.js"],
            output: {
                format: "esm"
            }
        }));

    const directories = src([baseSourceFolder + "options/**/*", baseSourceFolder + "_locales/**/*"], {base: "./src/"});

    return mergeStream(singleFiles, scripts, directories)
        .pipe(dest(outputFolderChrome));
}

function packageChrome() {
    return new Promise((resolve, reject) => {
        _7z.pack(`./${outputFolderChrome}/*`, `${baseOutputFolder}/youtube-hide-controls_chrome_${version}.zip`, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

function watchAllCodeFiles() {
    return watch([
        baseSourceFolder + "manifest_chrome.json",
        baseSourceFolder + "manifest_firefox.json",
        baseSourceFolder + "content-script.js",
        baseSourceFolder + "settings.js",
        baseSourceFolder + "player.js",
        baseSourceFolder + "options/*"
    ], parallel(firefox, chrome));
}

const firefox = series(cleanFirefox, buildFirefox, packageFirefox);
exports.firefox = firefox;

const chrome = series(cleanChrome, buildChrome, packageChrome);
exports.chrome = chrome;

exports.watch = watchAllCodeFiles;

exports.default = parallel(
    chrome,
    firefox
);
