var pageMod = require("sdk/page-mod");
var options = require("sdk/simple-prefs");

pageMod.PageMod({
  include: [/.*youtube\.com\/watch\?.*/, /.*youtube\.com\/user.*/],
  contentScriptFile: "./watch_script.js",
  attachTo: ["existing", "top"],
  onAttach: function(worker) {
    worker.port.emit("prefs", options.prefs);
  }
});