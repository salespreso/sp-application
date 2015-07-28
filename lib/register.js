import _ from "lodash";
import Promise from "bluebird";
import log from "./log";

/**
 * @module application
 * @submodule register
 */

let _modules = {};

/**
 * Global registration class. Used for dynamically importing
 * applications and middleware on startup.
 * @class Register
 *
 */
export class Register {
	static get registry() {
		return _modules;
	}

	/**
	 * Dynamically loads a module
	 * @method import
	 * @static
	 * @param {(string|string[])} paths - Module(s) to import
	 * @returns {Promise}
	 */
	static import(prefix, paths) {

		let appPrefix = prefix;
		if (!paths) {
			paths = prefix;
			appPrefix = "";
		}

		if (_.isArray(paths)) {
			let modules = paths;
			let imports = modules.map(async (name) => {
				return this.import(appPrefix, name);
			}, this);

			return Promise.all(imports);
		}

		let path = paths;

		if (appPrefix) {
			path = `${appPrefix}.${path}`;
		}

		// If it already exists, return it
		let _registered = this.get(path);
		if (_registered) {
			return _registered;
		}

		// Convert period delimited string to an actual path
		path = path.replace(/\./g, "/");

		log.debug(`Loading ${path}`);
		return Promise.resolve(System.import(path))
			.bind(this)
			.catch(e => {
				log.error(`Failed to load: ${e}`);
				throw e;
			})
			.then(function(app) {
				let obj = app.default || app;
				this.register(paths, obj);
				return obj;
			});
	}

	/**
	 * Return a registered plugin
	 * @method get
	 * @static
	 * @param {string} name
	 */
	static get(name) {
		let _registered = this.registry[name];
		return _registered || null;
	}

	/**
	 * Register a plugin
	 * @method register
	 * @static
	 * @param {string} name
	 * @param {function} module
	 */
	static register(name, module) {
		this.registry[name] = module;
	}
}

