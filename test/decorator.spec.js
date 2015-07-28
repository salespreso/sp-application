import {ApplicationRunner} from "lib/runner";
import {parent, application} from "lib/decorators";

describe("Decorator", () => {
	describe("@parent", () => {
		it("should set the parent's target value", () => {
			@parent("testparent")
			class ParentDecoratorTest {}
			assert.equal(ParentDecoratorTest._parent, "testparent");
		});
	});

	describe("@application", () => {
		it("should register an application", () => {
			@application()
			class TestApplication {}
			assert.equal(ApplicationRunner.registered["testapplication"], TestApplication);
		});

		it("should fail to register an application that exists", () => {
			try {
				@application()
				class TestApplication {}
				assert.throw("application registered twice when it shouldn't");
			} catch(e) {
				// no-op
			}
		});
	});
});
