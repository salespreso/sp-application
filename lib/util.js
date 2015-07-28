import _ from "lodash";
import {React} from "react";

/**
 * @module application
 * @submodule util
 * @class Util
 */

/**
 * Copies all static and prototype methods/fields from classB
 * to classA IF they don't already exist. Consider this like
 * _.defaults in lodash for classes.
 * @method extendClass
 * @static
 * @param classA {function} - The class to extend
 * @param classB {function} - The class we're copying
 */
export let extendClass = function(classA, classB) {
	// Copy static methods from the middleware class
	for (let key of Object.getOwnPropertyNames(classB)) {
		if (!classA.hasOwnProperty(key)) {
			classA[key] = classB[key];
		}
	}

	for (let key of Object.getOwnPropertyNames(classB.prototype)) {
		if (!classA.prototype.hasOwnProperty(key)) {
			classA.prototype[key] = classB.prototype[key];
		}
	}
};

// Monkeypatch to disable really annoying warning from a context issue. Related to the
// getChildrenWithContext method used. See for reasonings:
// https://github.com/tajo/react-portal/issues/8
// https://github.com/rackt/react-modal/issues/37
// This should be fixed for react 0.14
let warn = console.warn;
let warningFilterKey = function(warning) {
	return warning.indexOf("Warning: owner-based and parent-based contexts differ") >= 0
};
let throttledWarn = _.throttle(function() {
	warn.call(console,"Throttled warning about React owner/parent based contexts, see https://github.com/facebook/react/issues/4081 for reasons");
	warn.apply(console, arguments);
}, 60000);
console.warn = function() {
	if ( arguments && arguments.length > 0 && typeof arguments[0] === "string" && warningFilterKey(arguments[0]) ) {
		throttledWarn.apply(throttledWarn,arguments);
	}
	else {
		warn.apply(console, arguments);
	}
};

/**
 * Displays children of a react component, passing along all of the parent's contexts.
 * This is not done in 0.13.x, but 0.14 will make this method unecessary.
 * @method getChildrenWithContext
 * @static
 * @param {Object} scope
 */
export let getChildrenWithContext = function(scope) {
	return React.Children.map(scope.props.children, function(child) {
		return React.cloneElement(child, {
			locales: scope.props.locales,
			messages: scope.props.messages
		});
	});
};



