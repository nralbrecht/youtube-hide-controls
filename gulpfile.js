const { parallel, src, dest, series } = require("gulp");
const del = require("del");
const zip = require("gulp-zip");
const rename = require("gulp-rename");
const mergeStream = require("merge-stream");
const jsonModify = require("gulp-json-modify");

const version = require("./package.json").version;
const baseOutputFolder = "build";
const outputFolderFirefox = baseOutputFolder + "/firefox";
const outputFolderChrome = baseOutputFolder + "/chrome";

function cleanFirefox() {
    return del(outputFolderFirefox, {force: true});
}

function buildFirefox() {
    const singleFiles = src("manifest_firefox.json")
        .pipe(rename("manifest.json"))
        .pipe(jsonModify({
            key: "version",
            value: version
        }))
        .pipe(src(["content-script.js", "player.js", "images/icon.svg"]));

    const directorys = src(["options/**/*", "_locales/**/*"], {base: "."});

    return mergeStream(singleFiles, directorys)
        .pipe(dest(outputFolderFirefox))
        .pipe(zip("youtube-hide-controls_firefox_" + version + ".zip"))
        .pipe(dest(baseOutputFolder));
}

function cleanChrome() {
    return del(outputFolderChrome, {force: true});
}

function buildChrome() {
    const singleFiles = src("manifest_chrome.json")
        .pipe(rename("manifest.json"))
        .pipe(jsonModify({
            key: "version",
            value: version
        }))
        .pipe(src(["content-script.js", "player.js", "images/icon_128.png"]));

    const directorys = src(["options/**/*", "_locales/**/*"], {base: "."});

    return mergeStream(singleFiles, directorys)
        .pipe(dest(outputFolderChrome))
        .pipe(zip("youtube-hide-controls_chrome_" + version + ".zip"))
        .pipe(dest(baseOutputFolder));
}

const firefox = series(cleanFirefox, buildFirefox);
exports.firefox = firefox;

const chrome = series(cleanChrome, buildChrome);
exports.chrome = chrome;

exports.default = parallel(
    chrome,
    firefox
);
