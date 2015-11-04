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
export const extendClass = function(classA, classB) {
	// Copy static methods from the middleware class
	for (const key of Object.getOwnPropertyNames(classB)) {
		if (!classA.hasOwnProperty(key)) {
			classA[key] = classB[key];
		}
	}

	for (const key of Object.getOwnPropertyNames(classB.prototype)) {
		if (!classA.prototype.hasOwnProperty(key)) {
			classA.prototype[key] = classB.prototype[key];
		}
	}
};
