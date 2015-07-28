import {Register} from "lib/register";

let appPath = "test.testfiles";

describe("Register", () => {
	beforeEach(() => {
		for (let key in Register.registry) {
			Register.unregister(key);
		}
	});

	describe("#import()", () => {
		it("should import a testfile with a single path parameter", async () => {
			let app = await Register.import(appPath + ".file");
			assert.isObject(app);
			assert.equal(Register.get(appPath + ".file"), app);
		});

		it("should retrieve a testfile with a prefix", async () => {
			let app = await Register.import("test", "testfiles.file");
			assert.isObject(app);
		});

		it("should retrieve a testfile as part of an array", async () => {
			let app = await Register.import([appPath + ".file"]);
			assert.isArray(app);
			assert.isObject(app[0]);
		});

		it("should retrieve a testfile as part of an array with a prefix", async () => {
			let app = await Register.import("test.testfiles", ["file"]);
			assert.isArray(app);
			assert.isObject(app[0]);
		});

		it("should return an app without a default", async () => {
			let app = await Register.import(appPath + ".file-no-default");
			assert.isUndefined(app.default);
			assert.isObject(app);
		});

		it("should return an error on file not existing", async () => {
			try {
				let app = await Register.import("foo.bar.baz");
				assert.throw("File exists when it shouldn't");
			} catch (e) {
				// no-op
			}
		});
	});
});

