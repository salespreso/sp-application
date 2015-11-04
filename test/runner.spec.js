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
		it("should throw an error if not returning an object", () => {
			class App1 {static routes() { return {}; }}

			const func = () => ApplicationRunner.add("app1", App1);
			assert.throws(func, Error,
				`Application app1 "routes" is not returning an object. Did you mean 'static get routes'?`
			);
		});

		it("should create a route from an application", () => {
			const app1Route = {
				"/app1/route1/": "route"
			};

			class App1 { static get routes() { return app1Route; } }
			ApplicationRunner.add("app1", App1);
			const routes = ApplicationRunner.createRoutes();
			assert.deepEqual(routes, {
				"/app1/route1/": "app1.route"
			});
		});

		it("should nest child signals under parent", () => {
			const app1Route = {"/app1/route1/": "route1"};
			const app2Route = {"/app2/route1/": "route2"};

			class App1 { static get routes() { return app1Route; } }
			@parent("app1")
			class App2 { static get routes() { return app2Route; } }

			ApplicationRunner.add("app1", App1);
			ApplicationRunner.add("app2", App2);

			const routes = ApplicationRunner.createRoutes();
			assert.deepEqual(routes, {
				"/app1/route1/": "app1.route1",
				"/app2/route1/": "app1.app2.route2"
			});
		});

		it("should remove any unused routes", () => {
			class App1 {}
			ApplicationRunner.add("app1", App1);
			const routes = ApplicationRunner.createRoutes();
			assert.deepEqual(routes, {});
		});
	});

	describe("#createSignals", () => {
		it("should throw an error if not returning an object", () => {
			class App1 { static signals() { return {}; } }

			const func = () => ApplicationRunner.add("app1", App1);
			assert.throws(func, Error,
				`Application app1 "signals" is not returning an object. Did you mean 'static get signals'?`
			);
		});

		it("should create an app-prefixed object of signals", () => {
			function action() {}
			const signalObj = {
				signal1: [action]
			};
			class App1 { static get signals() { return signalObj; } }
			ApplicationRunner.add("app1", App1);

			const signals = ApplicationRunner.createSignals();
			assert.deepEqual(signals, {
				"app1.signal1": [action]
			});
		});
	});

	describe("#createStore", () => {
		it("should throw an error if not returning an object", () => {
			class App1 {static store() { return {}; }}

			const func = () => ApplicationRunner.add("app1", App1);
			assert.throws(func, Error,
				`Application app1 "store" is not returning an object. Did you mean 'static get store'?`
			);
		});

		it("should create a single list of stores", () => {
			class App1 { static get store() { return { foo: true }; } }
			@parent("app1")
			class App2 { static get store() { return { bar: true }; } }

			ApplicationRunner.add("app1", App1);
			ApplicationRunner.add("app2", App2);

			const store = ApplicationRunner.createStore();
			assert.deepEqual(store, {
				app1: {
					foo: true,
					app2: {
						bar: true
					}
				}
			});
		});
	});
});
