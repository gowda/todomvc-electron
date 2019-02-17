import {
  expect,
  getTestClient,
  startApplication,
  stopApplication,
  TestClient,
} from "./helpers";

describe("Application list filters", () => {
  let client: TestClient;
  const testTodoLabels: string[] = [
    "todo list test todo label - 01",
    "todo list test todo label - 02",
    "todo list test todo label - 03",
    "todo list test todo label - 04",
    "todo list test todo label - 05",
  ];
  const testCompletedTodoLabels: string[] =
    testTodoLabels.map((label) => `${label} - completed`);
  const testActiveTodoLabels: string[] =
    testTodoLabels.map((label) => `${label} - active`);

  before(() => {
    return startApplication().then((app) => { client = getTestClient(app); });
  });

  testActiveTodoLabels.forEach((label) => {
    before(() => {
      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(label);
        })
        .then(() => {
          return client.keys(["Enter"]);
        })
        .then(() => {
          return client.waitUntilTextExists("li > div.view > label", label);
        });
    });

    after(() => {
      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$(`label=${label}`).click();
        })
        .then(() => {
          return client.$("button.destroy").click();
        })
        .catch((_) => {
          return Promise.resolve(`nothing to delete: ${label}`);
        });
    });
  });

  testCompletedTodoLabels.forEach((label) => {
    before(() => {
      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$("input.new-todo").setValue(label);
        })
        .then(() => {
          return client.keys(["Enter"]);
        })
        .then(() => {
          return client.waitUntilTextExists("li > div.view > label", label);
        })
        .then(() => {
          return client.$(`label=${label}`).$("..").$("input.toggle").click();
        });
    });

    after(() => {
      return client.waitUntilWindowLoaded()
        .then(() => {
          return client.$(`label=${label}`).click();
        })
        .then(() => {
          return client.$("button.destroy").click();
        })
        .catch((_) => {
          return Promise.resolve(`nothing to delete: ${label}`);
        });
    });
  });

  after(() => {
    return stopApplication();
  });

  describe("'All' filter", () => {
    before(() => {
      return client.$("button=All").click();
    });

    testActiveTodoLabels.concat(testCompletedTodoLabels).forEach((label) => {
      it(`lists "${label}"`, () => {
        return client.waitUntilWindowLoaded()
          .then(() => {
            return client.waitUntilTextExists("li > div.view > label", label);
          });
      });
    });
  });

  describe("'Active' filter", () => {
    before(() => {
      return client.$("button=Active").click();
    });

    after(() => {
      return client.$("button=All").click();
    });

    testActiveTodoLabels.forEach((label) => {
      it(`lists "${label}"`, () => {
        return client.waitUntilWindowLoaded()
          .then(() => {
            return client.waitUntilTextExists("li > div.view > label", label);
          });
      });
    });

    testCompletedTodoLabels.forEach((label) => {
      it(`does not list "${label}"`, () => {
        return expect(
          client.waitUntilWindowLoaded()
            .then(() => {
              return client.$(`label=${label}`);
            })
            .then((response: any) => {
              if (response.type === "NoSuchElement" &&
                response.message.include("element could not be located")) {
                return Promise.reject(
                  new Error(`Could not find todo item for ${label}`)
                );
              }

              console.log(`Todo node search result for ${label}:`, response);
              return Promise.resolve(response);
            })
        ).to.eventually.be.rejected;
      });
    });
  });

  describe("'Completed', filter", () => {
    before(() => {
      return client.$("button=Completed").click();
    });

    after(() => {
      return client.$("button=All").click();
    });

    testActiveTodoLabels.forEach((label) => {
      it(`does not list "${label}"`, () => {
        return expect(
          client.waitUntilWindowLoaded()
            .then(() => {
              return client.$(`label=${label}`);
            })
            .then((response: any) => {
              if (response.type === "NoSuchElement" &&
                response.message.include("element could not be located")) {
                return Promise.reject(
                  new Error(`Could not find todo item for ${label}`)
                );
              }

              console.log(`Todo node search result for ${label}:`, response);
              return Promise.resolve(response);
            })
        ).to.eventually.rejected;
      });
    });

    testCompletedTodoLabels.forEach((label) => {
      it(`lists "${label}"`, () => {
        return client.waitUntilWindowLoaded()
          .then(() => {
            return client.waitUntilTextExists("li > div.view > label", label);
          });
      });
    });
  });
});
