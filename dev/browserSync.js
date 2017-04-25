// Create an named instance in one file...
var bs = require("browser-sync").create('EventSky dev server');

// Start the Browsersync server
bs.init({
	server: true
});

// watch our build.js that is output by rollup
bs.watch('build.js').on('change', bs.reload);