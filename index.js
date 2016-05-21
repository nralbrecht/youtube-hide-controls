var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: [/.*youtube\.com\/watch\?.*/, /.*youtube\.com\/user.*/],
  contentScriptFile: "./watch_script.js"
});