import React from "react";
import {Route} from "react-router";
import {parent} from "lib/decorators";
import {ApplicationRunner} from "lib/runner";


describe("ApplicationRunner", () => {
	beforeEach(() => {
		for (let key in ApplicationRunner.registered) {
			ApplicationRunner.remove(key);
		}
	});

	describe("#add", () => {
		it("should generate a flat list of applications", () => {
			class App1 {}
			class App2 {}
			ApplicationRunner.add("app1", App1);
			ApplicationRunner.add("app2", App2);
			assert.equal(Object.keys(ApplicationRunner.registered).length, 2);
			assert.equal(ApplicationRunner.registered.app1, App1);
			assert.equal(ApplicationRunner.registered.app2, App2);
		});
	});

	describe("#createRoutes", () => {
		it("should create a route from an application", () => {
			let app1Route = (<Route path="app1" />);
			class App1 { static get routes() { return app1Route; } }
			ApplicationRunner.add("app1", App1);
			let routes = ApplicationRunner.createRoutes();
			assert.equal(routes[0], app1Route);
			assert.equal(routes[0].props.path, "app1");
		});

		it("should nest a child in a parent application", () => {
			let app1Route = (<Route path="app1" />);
			let app2Route = (<Route path="app2" />);
			class App1 { static get routes() { return app1Route; } }

			@parent("app1")
			class App2 { static get routes() { return app2Route; } }

			ApplicationRunner.add("app1", App1);
			ApplicationRunner.add("app2", App2);

			let routes = ApplicationRunner.createRoutes();
			assert.equal(routes[0].props.children[0].props.path, "app2");
			assert.equal(routes[0].props.children[0], app2Route);
		});
	});

	describe("#createStore", () => {
		it("should create a single list of stores", () => {
			class App1 { static get store() { return { foo: true }; } }
			class App2 { static get store() { return { bar: true }; } }

			ApplicationRunner.add("app1", App1);
			ApplicationRunner.add("app2", App2);

			let store = ApplicationRunner.createStore();
			assert.deepEqual(store, {
				app1: { foo: true },
				app2: { bar: true }
			});
		});
	});
});
