import {
  expect,
  getTestClient,
  startApplication,
  stopApplication,
  TestClient,
} from "./helpers";

describe("Application launch", () => {
  let client: TestClient;

  before(() => {
    return startApplication().then((app) => { client = getTestClient(app); });
  });

  after(() => {
    return stopApplication();
  });

  describe("new todo form", () => {
    it("is focussed on page load", () => {

      return client.waitUntilWindowLoaded()
        .then(() => {
          return (client.$("input.new-todo") as any).hasFocus();
        })
        .then((focusState) => {
          return expect(focusState).to.be.true;
        });
    });

    it("saves the change on focus blur", () => {
      const testTodoLabel: string = "Test todo label for focus blur";

      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(testTodoLabel);
        })
        .then(() => {
          return client.$("footer.info").click();
        })
        .then(() => {
          return client
            .waitUntilTextExists("li > div.view > label", testTodoLabel);
        });
    });

    it("saves the change on ENTER key", () => {
      const testTodoLabel: string = "Test todo label for enter key";

      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(testTodoLabel);
        })
        .then(() => {
          return client.keys(["Enter"]);
        })
        .then(() => {
          return client
            .waitUntilTextExists("li > div.view > label", testTodoLabel);
        });
    });

    it("saves the trimmed value from input", () => {
      const testTodoLabel: string = "Test todo label for trimmed value";
      const untidyLabel: string = `     ${testTodoLabel}             `;

      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(untidyLabel);
        })
        .then(() => {
          return client.keys(["Enter"]);
        })
        .then(() => {
          return client
            .waitUntilTextExists("li > div.view > label", testTodoLabel);
        });
    });

    it("discards the change on ESC key", () => {
      const testTodoLabel: string = "Test todo label for ESC key";

      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(testTodoLabel);
        })
        .then(() => {
          return client.keys(["Escape"]);
        })
        .then(() => {
          return client.$(`label=${testTodoLabel}`);
        })
        .then((element) => {
          return Promise.all([
            expect((element as any)).to.have.property("state").equal("failure"),
            expect((element as any)).to.have
              .property("type").equal("NoSuchElement"),
            expect((element as any)).to.have
              .property("message").to.include("element could not be located"),
          ]);
        });
    });
  });
});
