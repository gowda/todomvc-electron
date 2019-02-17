import {
  getTestClient,
  isElementHidden,
  startApplication,
  stopApplication,
  TestClient,
} from "./helpers";

// TODO: check if this is useful
// https://github.com/marcodejongh/chai-webdriverio

describe("Application todo list", () => {
  let client: TestClient;
  const testTodoLabels: string[] = [
    "todo list test todo label - 01",
    "todo list test todo label - 02",
    "todo list test todo label - 03",
    "todo list test todo label - 04",
    "todo list test todo label - 05",
    "todo list test todo label - 06",
    "todo list test todo label - 07",
  ];

  before(() => {
    return startApplication().then((app) => { client = getTestClient(app); });
  });

  testTodoLabels.forEach((label) => {
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

  after(() => {
    return stopApplication();
  });

  it("shows the right count in footer", () => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        const selector = `span.todo-count=${testTodoLabels.length} items left`;
        return (client.$(selector) as any).isVisible();
      });
  });

  it("shows the clear completed button", () => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        const selector = `button.clear-completed`;
        return (client.$(selector) as any).isVisible();
      });
  });

  it("marks all as completed on clicking mark all as complete", () => {
    return client.waitUntilWindowLoaded()
      .then(() => {
        const selector = "input.toggle-all";
        return client.$(selector).click();
      })
      .then(() => {
        const selector = "button.clear-completed";
        return client.$(selector).click();
      })
      .then(() => {
        return isElementHidden(client, "section.main");
      })
      .then(() => {
        return isElementHidden(client, "footer.footer");
      });
  });

  context.skip("when all todos are active", () => {
    it("clear completed button is not visible", () => {});
  });

  context.skip("when few todos are completed", () => {
    context("when filter is set to 'Completed'", () => {
      it("footer is visible", () => {});
    });
  });
});
