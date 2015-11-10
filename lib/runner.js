import _ from "lodash";
import log from "./log";

/**
 * @module application
 * @submodule runner
 */

/**
 * @class ApplicationRunner
 */
export class ApplicationRunner {
	static applications = {}

	/**
	 * @method add
	 * @static
	 * @param {String} name
	 * @param {Application} module
	 */
	static add(name, module) {
		if (ApplicationRunner.applications[name]) {
			throw new Error(`Can not add application ${name} as it already exists!
				Application names must be unique.`);
		}

		const staticGets = ["routes", "signals", "store"];

		for (const staticGet of staticGets) {
			// Give a default object if it hasn't been defined on the app itself
			if (typeof module[staticGet] === "undefined") {
				module[staticGet] = {};
			}

			// Give a helpful error if an object isn't returned, or the
			// function hasn't been returned as a getter
			if (typeof module[staticGet] !== "object") {
				throw new Error(`Application ${name} "${staticGet}" is not returning an object. Did you mean 'static get ${staticGet}'?`);
			}
		}

		log.info(`Registered application "${name}"`);
		ApplicationRunner.applications[name] = module;
	}

	/**
	 * @method remove
	 * @static
	 * @param {String} name
	 */
	static remove(name) {
		if (!ApplicationRunner.applications[name]) {
			throw new Error(`Can not remove application ${name} as it does not exist.`);
		}

		delete ApplicationRunner.applications[name];
	}

	/**
	 * @property registered
	 * @static
	 */
	static get registered() {
		return ApplicationRunner.applications;
	}

	static _generateAssociations(type) {
		const associations = {};
		const registry = {...ApplicationRunner.registered};
		for (const registered in registry) {
			const App = registry[registered];
			if (!_.isEmpty(App[type])) {
				let name = registered;
				const prefix = ApplicationRunner._getParentPrefix(App);
				if (prefix.length) {
					name = `${prefix.join(".")}.${registered}`;
				}
				_.extend(associations, {
					[name]: App[type]
				});
			}
		}
		return associations;
	}

	static _getParentPrefix(App) {
		const prefix = [];
		let appParent = App._parent;
		while (appParent) {
			prefix.unshift(appParent);
			appParent = ApplicationRunner.registered[appParent]._parent;
		}
		return prefix;
	}

	static _prefixObjectRecursive(obj, prefix) {
		if (typeof obj === "string") {
			return _.flatten([prefix, obj]).join(".");
		} else if (_.isObject(obj)) {
			const newObj = {};
			for (const key in obj) {
				newObj[key] = ApplicationRunner._prefixObjectRecursive(obj[key], prefix);
			}
			return newObj;
		}
	}

	/**
	 * @method createRoutes
	 * @static
	 * @returns {Object}
	 */
	static createRoutes() {
		const routes = {};
		const registry = {...ApplicationRunner.registered};
		for (const registered in registry) {
			const App = registry[registered];
			const appRoutes = {...(App.routes || {})};
			for (const appRoute of Object.keys(appRoutes)) {
				if (typeof routes[appRoute] !== "undefined") {
					throw new Error(`Route "${appRoute}" already exists! Duplicate was found in the "${App.name}" app`);
				} else {
					const prefix = ApplicationRunner._getParentPrefix(App);
					prefix.push(registered);
					const signalName = appRoutes[appRoute];

					if (_.isString(signalName) || _.isObject(signalName)) {
						routes[appRoute] = ApplicationRunner._prefixObjectRecursive(signalName, prefix);
					} else {
						throw new Error(`Route ${appRoute} value must be an object or a string. Receieved: ${typeof signalName}`);
					}
				}
			}
		}

		return routes;
	}

	/**
	 * @method createSignals
	 * @static
	 * @returns {Object}
	 */
	static createSignals() {
		const signals = {};
		const registry = {...ApplicationRunner.registered};
		for (const registered in registry) {
			const App = registry[registered];
			const appSignals = {...(App.signals || {})};
			for (const appSignal of Object.keys(appSignals)) {
				if (typeof signals[appSignal] !== "undefined") {
					throw new Error(`Signal "${appSignal}" already exists! Duplicate was found in the "${App.name}" app`);
				} else {
					const prefix = ApplicationRunner._getParentPrefix(App);
					prefix.push(registered, appSignal);
					signals[prefix.join(".")] = appSignals[appSignal];
				}
			}
		}

		return signals;
	}

	/**
	 * @method createStore
	 * @static
	 * @return {Object}
	 */
	static createStore() {
		const assocs = ApplicationRunner._generateAssociations("store");
		const store = {};
		const registry = {...ApplicationRunner.registered};

		function checkAssoc(assocs, registered) {
			return _.find(assocs, function(assoc) {
				return _.last(assoc.split(".")) === registered;
			});
		}

		for (const registered in registry) {
			const App = registry[registered];
			const assocName = checkAssoc(Object.keys(assocs), registered);
			_.set(store, assocName, App.store);
		}
		return store;
	}
}
