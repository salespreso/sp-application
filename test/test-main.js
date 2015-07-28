import Promise from "bluebird";
import _ from "lodash";
import { Log, LogLevel } from "sp-log";

Log.setAllLevels(LogLevel.SILENT);

var karma = window.__karma__;

// Convert the files object to an array of file paths.
// Find all the karma tests that we've added
let files = _.chain(karma.files).map(function(id, file) { return file; });
let tests = files.filter(function(file) {
  return /^\/base\/test\/.*\.spec\.js$/.test(file);
}).value();

// Manually import each test with systemjs
Promise.map(tests, function(test) {
	return Promise.resolve(System.import(test.replace("/base/", "").replace(".js", "")));
})
.catch(function(e) {
	console.error(e.stack || e);
})
.finally(function() {
	// Finally manually boot up the test.
	karma.realStart();
});

