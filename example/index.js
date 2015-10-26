import React from "react";
import {Route} from "react-router";
import {ApplicationRunner} from "lib/runner";
import {parent, application} from "lib/decorators";
import {monkey} from "baobab";

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
			},
			aCursor: monkey({
				cursors: [],
				get() {
					return "hello";
				}
			}),
			another: monkey({
				cursors: {
					foo: ["foo"]
				},
				get(data) {
					return data.foo;
				}
			})
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
			},
			hai: monkey({
				cursors: {
					foo: ["testStore", "foo"]
				},
				get(data) {
					return data.foo;
				}
			})
		};
	}
}

log.info(`routes: ${JSON.stringify(ApplicationRunner.createRoutes(), null, 2)}`);
log.info(`stores: ${JSON.stringify(ApplicationRunner.createStore(), null, 2)}`);
