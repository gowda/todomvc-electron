import {
  getTestClient,
  isElementHidden,
  startApplication,
  stopApplication,
  TestClient,
} from "./helpers";

describe("Application launch", () => {
  let client: TestClient;

  before(() => {
    return startApplication().then((app) => client = getTestClient(app));
  });

  after(() => {
    return stopApplication();
  });

  it("hides mark all as complete button", () => {
    return isElementHidden(client, "button.clear-completed");
  });

  it("hides the list", () => {
    return isElementHidden(client, "section.main");
  });

  it("hides the list footer", () => {
    return isElementHidden(client, "footer.footer");
  });
});
