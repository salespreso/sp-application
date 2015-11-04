import _ from "lodash";
import Promise from "bluebird";
import log from "./log";

/**
 * @module application
 * @submodule register
 */

const _modules = {};

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
	 * Unregister a module
	 * @method unregister
	 * @static
	 * @param {String} name
	 */
	static unregister(name) {
		if (Register.get(name)) {
			delete _modules[name];
		}
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
			const modules = paths;
			const imports = modules.map(async (name) => {
				return Register.import(appPrefix, name);
			});

			return Promise.all(imports);
		}

		let path = paths;

		if (appPrefix) {
			path = `${appPrefix}.${path}`;
		}

		// If it already exists, return it
		const _registered = Register.get(path);
		if (_registered) {
			return _registered;
		}

		// Convert period delimited string to an actual path
		path = path.replace(/\./g, "/");

		log.debug(`Loading ${path}`);
		return Promise.resolve(System.import(path))
			.catch(e => {
				log.error(`Failed to load: ${e}`);
				throw e;
			})
			.then(function(app) {
				const obj = app.default || app;
				Register.register(paths, obj);
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
		const _registered = Register.registry[name];
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
		Register.registry[name] = module;
	}
}
