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

		log.info(`Registered application "${name}"`);
		applications[name] = module;
	}

	/**
	 * @method remove
	 * @static
	 * @param {String} name
	 */
	static remove(name) {
		if (!applications[name]) {
			throw new Error(`Can not remove application ${name} as it does not exist.`);
		}

		delete applications[name];
	}

	/**
	 * @property registered
	 * @static
	 */
	static get registered() {
		return applications;
	}

	static _generateAssociations(type) {
		let associations = {};
		let registry = applications;
		for (let registered in registry) {
			let app = registry[registered];
			if (!_.isEmpty(app[type])) {
				let name = registered;
				let prefix = [];
				let appParent = app._parent;
				while (appParent) {
					prefix.unshift(appParent);
					if (associations[appParent]) {
						appParent = associations[appParent]._parent;
					} else {
						// FIXME: This has been an issue on loadup... but is possibly not
						// strictly necessary. Need to figure out the reason that this can
						// get called.
						appParent = false;
					}
				}
				if (prefix.length) {
					name = `${prefix.join(".")}.${registered}`;
				}
				_.extend(associations, {
					[name]: app[type]
				});
			}
		}
		return associations;
	}

	/**
	 * @method createFacets
	 * @static
	 * @return {Object}
	 */
	static createFacets() {
		let assocs = this._generateAssociations("facets");
		let facets = {};
		for (let assoc in assocs) {
			let objs = assocs[assoc];
			for (let obj in objs) {
				let name = `${assoc}.${obj}`;
				log.info(`Created facet "${name}"`);
				facets[name] = objs[obj];
			}
		}
		return facets;
	}

	/**
	 * @method createRoutes
	 * @static
	 * @returns {ReactElement[]}
	 */
	static createRoutes() {
		let routes = this._generateAssociations("routes");

		let returnedRoutes = {};
		for (let key in routes) {
			let split = key.split(".");
			if (split.length > 1 && !_.isEmpty(routes[key])) {
				let p = split.slice(0, -1).join(".");
				let children = React.Children.toArray(routes[p].props.children || []);
				children.push(routes[key]);
				// Doing this gives our children keys
				children = React.Children.toArray(children);
				returnedRoutes[p] = React.cloneElement(routes[p], routes[p].props, children);
			} else {
				returnedRoutes[key] = routes[key];
			}
		}

		return _.values(returnedRoutes);
	}

	/**
	 * @method createStore
	 * @static
	 * @return {Object}
	 */
	static createStore() {
		let assocs = this._generateAssociations("store");
		let store = {};
		let registry = applications;
		for (let registered in registry) {
			let app = registry[registered];
			let assocName = _.find(Object.keys(assocs), function(assoc) {
				return _.last(assoc.split(".")) === registered;
			});
			_.extend(store, {
				[assocName]: app.store
			});
		}
		return store;
	}
}
