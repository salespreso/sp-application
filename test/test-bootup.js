// The jspm adapter calls start too early, so we have to override
// the function and call our on own version.
window.__karma__.realStart = window.__karma__.start;
window.__karma__.start = function() {};

System.import("test/test-main");
