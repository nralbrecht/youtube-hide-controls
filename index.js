var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: /.*youtube\.com\/watch\?.*/,
  contentScriptFile: "./watch_script.js"
});

pageMod.PageMod({
  include: /.*youtube\.com\/user.*/,
  contentScriptFile: "./watch_script.js"
});