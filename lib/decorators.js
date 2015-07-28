import {ApplicationRunner} from "./runner";
import {Application} from "./index";
import {extendClass} from "./util";

/**
 * @module application
 * @submodule decorators
 * @class Decorators
 */

/**
 * Adds the parent value to a class. Used to set a child application
 * to a parent application. For example, if I have the `appointments` app,
 * after using this decorator @parent("ui"), it changes it to become
 * "ui.appointments". Note in the example that decorators are
 * called with "@" not "//@", but the documentation tool will accidently parse
 * it.
 * @method parent
 * @static
 * @param {string} value
 * @returns {function}
 * @example
 * ```javascript
 * //@parent("parentApp")
 * //@application()
 * class MyApp {
 *
 * }
 * ```
 */
export function parent(value) {
	return function(target) {
		target._parent = value;
	};
}

/**
 * Register an application, adding it to the application
 * runner. Note in the example that decorators are
 * called with "@" not "//@", but the documentation tool will accidently parse
 * it.
 * @method application
 * @static
 * @param {string} [value] - Name of the application (must be unique). If not
 * supplied, then uses the lowercase name of the class
 * @returns {function}
 * @example
 * ```javascript
 * //@application()
 * class MyApp {
 *
 * }
 * ```
 */
export function application(value) {
	return function(target) {
		extendClass(target, Application);
		let name = value || target.name.toLowerCase();
		ApplicationRunner.add(name, target);
	};
}
