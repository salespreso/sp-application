import {ApplicationRunner} from "lib/runner";
import {parent, application} from "lib/decorators";

@application()
class ParentApp {
	static get routes() {
		return {
			"/parent/": "opened",
			"/parent/:id/": "detailOpened",
			"/parent/create/": "createOpened"
		};
	}

	static get signals() {
		return {
			opened: [],
			detailOpened: [],
			createOpened: []
		};
	}

	static get store() {
		return {
			foo: true,
			bar: {
				baz: "baz"
			}
		};
	}
}

@parent("parentapp")
@application()
class ChildApp {
	static get routes() {
		return {
			"/parent/child/": "opened",
			"/parent/child/:id/": "detailOpened",
			"/parent/child/create/": "createOpened"
		};
	}

	static get signals() {
		return {
			opened: [],
			detailOpened: [],
			createOpened: []
		};
	}

	static get store() {
		return {
			foo: true,
			bar: {
				baz: "baz"
			}
		};
	}
}

const routes = ApplicationRunner.createRoutes();
const signals = ApplicationRunner.createSignals();
const store = ApplicationRunner.createStore();

log.info(`routes: ${JSON.stringify(routes, null, 2)}`);
log.info(`signals: ${JSON.stringify(signals, null, 2)}`);
log.info(`store: ${JSON.stringify(store, null, 2)}`);
