import _ from "lodash";
import React from "react";
import log from "./log";

/**
 * @module application
 * @submodule runner
 */

let applications = {};

/**
 * @class ApplicationRunner
 */
export class ApplicationRunner {
	/**
	 * @method add
	 * @static
	 * @param {String} name
	 * @param {Application} module
	 */
	static add(name, module) {
		if (applications[name]) {
			throw new Error(`Can not add application ${name} as it already exists!
				Application names must be unique.`);
		}

		log.info(`Registered application "${name}."`);
		applications[name] = module;
	}

	/**
	 * @property registered
	 * @static
	 */
	static get registered() {
		return applications;
	}

	/**
	 * @method createRoutes
	 * @static
	 * @returns {ReactElement[]}
	 */
	static createRoutes() {
		let routes = {};
		let registry = applications;
		for (let registered in registry) {
			let app = registry[registered];
			let name = registered;
			let prefix = [];
			let appParent = app._parent;
			while (appParent) {
				prefix.unshift(appParent);
				if (routes[appParent]) {
					appParent = routes[appParent]._parent;
				} else {
					appParent = false;
				}
			};
			if (prefix.length) {
				name = `${prefix.join(".")}.${registered}`;
			}
			_.extend(routes, {
				[name]: app.routes
			});
		}

		let returnedRoutes = [];

		for (let key in routes) {
			let split = key.split(".");
			if (split.length > 1) {
				let p = split.slice(0, -1).join(".");
				let newProps = routes[p].props;
				newProps.children = newProps.children || [];
				newProps.children.push(routes[key]);

				routes[p] = React.addons.cloneWithProps(routes[p], newProps);
			} else {
				returnedRoutes.push(routes[key]);
			}
		}

		return returnedRoutes;
	}

	/**
	 * @method createStore
	 * @static
	 * @return {Object}
	 */
	static createStore() {
		let store = {};
		let registry = applications;
		for (let registered in registry) {
			let app = registry[registered];
			_.extend(store, {
				[registered]: app.store
			});
		}
		return store;
	}
}
