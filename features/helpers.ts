import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import path from "path";
import { Application, SpectronClient } from "spectron";

chai.use(chaiAsPromised);
export const expect = chai.expect;

// required for typescript, SpectronClient doesn't expose browser APIs
// for interacting with the page
export type TestClient =
  SpectronClient & WebDriver.Client<void> & WebdriverIO.Browser<void>;

export const getTestClient = (app: Application) => {
  // FIXME: https://github.com/Microsoft/TypeScript/issues/28067
  return (app.client as unknown as TestClient);
};

export const isElementHidden = (client: TestClient, selector: string) => {
  return client.waitUntilWindowLoaded()
    .then(() => {
      // FIXME: update type definition for WebDriver.Browser<T>
      return (client.$(selector) as any).isVisible();
    })
    .then((visibility: boolean) => {
      return expect(visibility).to.be.false;
    });
};

// FIXME: where should the following setup go?
//
// FIXME: avoid casting, fix spectron type definitions
// https://github.com/electron/spectron/blob/v5.0.0/lib/spectron.d.ts
//
// chaiAsPromised.transferPromiseness = (testApp as any).transferPromiseness;

// FIXME: be more specific to who created the app
let testApp: Application;

export const startApplication = () => {
  console.log(`Current directory: ${__dirname}`);

  const electronPath = path.join(__dirname, "../node_modules/.bin/electron");
  const electronArgs = [path.join(__dirname, "..")];
  const webdriverLogPath =
    path.join(__dirname, "../logs/");
  const chromeDriverLogPath =
    path.join(__dirname, "../logs/chrome-driver.log");

  testApp = new Application({
    path: electronPath,
    args: electronArgs,
    webdriverLogPath,
    webdriverOptions: {
      deprecationWarnings: false,
    },
    chromeDriverLogPath,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true,
    },
  });

  return testApp.start();
};

export const stopApplication = () => {
  if (testApp && testApp.isRunning()) {
    return testApp.stop();
  }

  return Promise.reject(new Error("Test app is dead"));
};
