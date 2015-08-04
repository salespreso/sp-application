import React from "react";
import {Route} from "react-router";
import {ApplicationRunner} from "lib/runner";
import {parent, application} from "lib/decorators";

import {Log} from "sp-log";
let log = Log("example");

@application()
class ParentApp {
	static get routes() {
		return (
			<Route name="foo" />
		);
	}

	static get store() {
		return {
			foo: true,
			bar: false,
			baz: {
				hello: true
			}
		};
	}

	static get facets() {
		return {
			foo: {
				cursors: [],
				get() {
					return "hello";
				}
			},
			another: {
				cursors: ["hello"],
				get() {
					return "nothello";
				}
			}
		};
	}
}

@parent("parentapp")
@application()
class ChildApp {
	static get routes() {
		return (
			<Route name="bar" />
		);
	}

	static get store() {
		return {
			testStore: {
				foo: true,
				bar: "baz"
			}
		};
	}

	static get facets() {
		return {
			hai: {
				cursors: ["hai"],
				get() {
					return "hai";
				}
			}
		};
	}
}

log.info(`routes: ${JSON.stringify(ApplicationRunner.createRoutes(), null, 2)}`);
log.info(`facets: ${JSON.stringify(ApplicationRunner.createFacets(), null, 2)}`);
log.info(`stores: ${JSON.stringify(ApplicationRunner.createStore(), null, 2)}`);
