/**
 * Application structure that allows interconnection with other applications
 * (combining routes and expressing parent/child relationships)
 * @module application
 * @example
 * ```javascript
 * import {
 *   Application, Register, extendClass, getChildrenWithContext
 * } from "sp-application";
 * ```
 */

/**
 * Defines the interface needed to connect new components/stores/routes etc.
 * the to application as a whole. Note in the example that decorators are
 * called with "@" not "//@", but the documentation tool will accidently parse
 * it.
 * @class Application
 * @example
 * ```javascript
 * //@application()
 * class Foo {
 *   static get routes() {
 *     return {
 *       "/myfoos": {
 *         "/": "openIndex",
 *         "/:id": "openDetailPage"
 *       }
 *     };
 *   }
 *
 *   static get signals() {
 *     return {
 *       "openIndex": [setPage],
 *       "openDetailPage": [setPage, fetchStuff]
 *     };
 *   }
 *
 *   static get store() {
 *     return {
 *       hai: true
 *     };
 *   }
 * }
 * ```
 */
export class Application {
	/**
	 * Variables to be added to the store
	 * @method store
	 * @static
	 * @example
	 * ```javascript
	 * {
	 *  storeData: "foo"
	 * }
	 * ```
	 * @returns {object}
	 */
	static get store() {
		return {};
	}

	/**
	 * Cerebral router signals paths
	 * @method routes
	 * @static
	 * @example
	 * ```javascript
	 * {
	 *   "/messages/": "messageList",
	 *   "/messages/:id/": "message"
	 * }
	 * ```
	 * @returns {object}
	 */
	static get routes() {
		return {};
	}

	/**
	 * Signal/action pairings for cerebral and cerebral router
	 * @method signals
	 * @static
	 * @example
	 * ```javascript
	 * {
	 *   "action": [action1, action2, action3]
	 * }
	 * ```
	 * @returns {object}
	 */
	static get signals() {
		return {};
	}
}

export * from "./register";
export * from "./runner";
export * from "./util";
