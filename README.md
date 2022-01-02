# Hide YouTube video controls

Get the add-on from:
- [Mozilla add-on page](https://addons.mozilla.org/de/firefox/addon/hide-youtube-controls/)
- [Chrome web store](https://chrome.google.com/webstore/detail/hide-youtube-fullscreen-c/akkdefghgcakdgkmakeajmijjhlcofmk)
- [GitHub Release Page](https://github.com/nralbrecht/youtube-hide-controls/releases)

Does YouTube leave the video controls visible for longer than you like? Do you want to have a hotkey that toggles the controls?
This add-on gives you the tools to change that.

You can:
- Hide the video controls when you move the cursor to any border
- Toggle the controls when you press the configurable hotkey

In the add-on settings you can configure the individual sides as well as the hotkey.

If you experience any issues, please let me know [here](https://github.com/nralbrecht/youtube-hide-controls/issues).

## Building the add-on

A build pipeline using Gulp is set up to create artifacts that are then able to be installed and published.

First install the build dependencies.
```
npm install
```

Than you can build both Firefox and Google Chrome artifacts. The result can be found in the `build` directory.
```
npm run build
```

Alternatively you can just build one browser.
```
npm run build:firefox
npm run build:chrome
```

To debug the add-on see the respective documentation for [Google Chrome](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/) and [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).
