import {
  expect,
  getTestClient,
  startApplication,
  stopApplication,
  TestClient,
} from "./helpers";

describe("Application todo list item editing", () => {
  let client: TestClient;
  const testTodoLabel: string = "todo list test todo label - edit";

  before(() => {
    return startApplication().then((app) => { client = getTestClient(app); });
  });

  beforeEach(() => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$("input.new-todo").setValue(testTodoLabel);
      })
      .then(() => {
        return client.keys(["Enter"]);
      })
      .then(() => {
        return client.waitUntilTextExists(
          "li > div.view > label",
          testTodoLabel
        );
      });
  });

  after(() => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$(`label=${testTodoLabel}`).click();
      })
      .then(() => {
        return client.$("button.destroy").click();
      })
      .catch((_) => {
        return Promise.resolve(`nothing to delete: ${testTodoLabel}`);
      });
  });

  after(() => {
    return stopApplication();
  });

  it("activates editing on double click", () => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$(`label=${testTodoLabel}`).doubleClick();
      })
      .then(() => {
        return (client.$(`label=${testTodoLabel}`)
          .$("..").$("..").$("input.edit") as any).isVisible();
      })
      .then((visibility) => {
        return expect(visibility).to.be.true;
      });
  });

  it("saves the change on focus blur", () => {
    const changedLabel = `${testTodoLabel} update for focus blur`;

    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$(`label=${testTodoLabel}`).doubleClick();
      })
      .then(() => {
        return client.$(`label=${testTodoLabel}`)
          .$("..").$("..").$("input.edit").setValue(changedLabel);
      })
      .then(() => {
        return client.$("footer.info").click();
      })
      .then(() => {
        return client.waitUntilTextExists(
          "li > div.view > label",
          changedLabel
        );
      });
  });

  it("saves the change on ENTER key", () => {
    const changedLabel = `${testTodoLabel} update for ENTER key`;

    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$(`label=${testTodoLabel}`).doubleClick();
      })
      .then(() => {
        return client.$(`label=${testTodoLabel}`)
          .$("..").$("..").$("input.edit").setValue(changedLabel);
      })
      .then(() => {
        return client.keys(["Enter"]);
      })
      .then(() => {
        return client.waitUntilTextExists(
          "li > div.view > label",
          changedLabel
        );
      });
  });

  it("saves the trimmed value from input", () => {
    const changedLabel = `${testTodoLabel} update for trimmed value`;
    const untidyLabel: string = `     ${changedLabel}             `;

    return client.waitUntilWindowLoaded()
      .then(() => {
        return client.$(`label=${testTodoLabel}`).doubleClick();
      })
      .then(() => {
        return client.$(`label=${testTodoLabel}`)
          .$("..").$("..").$("input.edit").setValue(untidyLabel);
      })
      .then(() => {
        return client.keys(["Enter"]);
      })
      .then(() => {
        return client.waitUntilTextExists(
          "li > div.view > label",
          changedLabel
        );
      });
  });

  it("discards the change on ESC key", () => {
    const changedLabel = `${testTodoLabel} update for ESC key`;

    return expect(
      client.waitUntilWindowLoaded()
        .then(() => {
          return client.$(`label=${testTodoLabel}`).doubleClick();
        })
        .then(() => {
          return client.$(`label=${testTodoLabel}`)
            .$("..").$("..").$("input.edit").setValue(changedLabel);
        })
        .then(() => {
          return client.keys(["Escape"]);
        })
        .then(() => {
          return client.$(`label=${changedLabel}`);
        })
        .then((response: any) => {
          if (response.type === "NoSuchElement" &&
            response.message.include("element could not be located")) {
            return Promise.reject(
              new Error(`Could not find todo item for ${changedLabel}`)
            );
          }

          console.log(`Response for ${changedLabel}`, response);
          return Promise.resolve(response);
        })
    ).to.eventually.be.rejected;
  });
});
