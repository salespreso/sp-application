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
 *     <Route path="foos" component={MyComponent}>
 *       <Route path=":id" component={MyComponentDetail} />
 *     </Route>
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
	 *  cursorName: "foo"
	 * }
	 * ```
	 * @returns {object[]|Promise}
	 */
	static get store() {
		return [];
	}

	/**
	 * Route definition to be converted to the application routes.
	 * @method routes
	 * @static
	 * @example
	 * ```javascript
	 * <Route name="foo" handler={Foo} path="/">
	 *  <Route name="foo-detail" handler={FooDetail} path=":id" />
	 * </Route>
	 * ```
	 * @returns {object|Promise}
	 */
	static get routes() {
		return {};
	}
}

export * from "./register";
export * from "./runner";
export * from "./util";
