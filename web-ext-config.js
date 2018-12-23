module.exports = {
	artifactsDir: "../../binary/",
	ignoreFiles: [
		'README.md',
		"web-ext-config.js"
	],
	run: {
		startUrl: [
			"https://www.youtube.com/watch?v=EBmROluwLkc",
			"about:addons"
		]
	},
	build: {
		overwriteDest: true
	},
	lint: {
		warningsAsErrors: true
	}
};
