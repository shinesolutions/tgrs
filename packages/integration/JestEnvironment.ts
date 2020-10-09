import PuppeteerEnvironment from "jest-environment-puppeteer";
import {
  startGraphQlServer,
  startWebServer,
  ephemeralPort,
  StopServer,
  defaultWebServerPort,
} from "./environment";
import { startStubby } from "./environment/startStubby";

/**
 * A Jest environment for integration testing that, in addition to setting-up
 * and tearing-down Puppeteer, also starts a GraphQL server, web server, and
 * any other stub servers that they need to interact with.
 *
 * To set up Puppeteer only and not the servers, set the environment variable
 * `SETUP_SERVERS` to `false`. If you do this, the tests will assume the servers
 * are already running, with the web server available on it's default port.
 *
 * To run Puppeteer in a docker container, set the environment variable
 * `PUPPETEER_DOCKER` to `true`.
 */
export class JestEnvironment extends PuppeteerEnvironment {
  private stopStubServer?: StopServer;
  private stopGraphQlServer?: StopServer;
  private stopWebServer?: StopServer;
  /**
   * Starts all of the parts of the test stack, starting at the bottom and
   * working upwards
   */
  async setup() {
    try {
      const webServerEndpoint =
        process.env["SETUP_SERVERS"] !== "false"
          ? await this.setupServers()
          : {
              hostname: "127.0.0.1",
              port: defaultWebServerPort,
            };
      await super.setup();
      this.global.uriOrigin = `http://${webServerEndpoint.hostname}:${webServerEndpoint.port}`;
    } catch (error) {
      // Explicitly log errors as Jest doesn't seem to otherwise do it for us.
      // However, we still have to throw the error on.
      console.log(error);
      throw error;
    }
  }
  async setupServers() {
    // Start servers on ephemeral ports so that several environments can be run
    // on the same machine
    const stubServer = await startStubby({
      targetPort: ephemeralPort,
    });
    this.stopStubServer = stubServer.stop;

    const graphQlServer = await startGraphQlServer({
      targetPort: ephemeralPort,
      stubbyEndpoint: stubServer.endpoint,
    });
    this.stopGraphQlServer = graphQlServer.stop;

    const webServer = await startWebServer({
      targetPort: ephemeralPort,
      graphQlServerEndpoint: graphQlServer.endpoint,
    });
    this.stopWebServer = webServer.stop;

    return webServer.endpoint;
  }
  /**
   * Tears down all parts of the test stack, in reverse order to how they were
   * set up
   */
  async teardown() {
    const {
      global: { page },
      stopWebServer,
      stopGraphQlServer,
      stopStubServer,
    } = this;
    // If Puppeteer got setup successfully,
    if (page) {
      // Go to a blank page in the browser to stop any polling GraphQL queries
      // that might otherwise block shutdown
      await page.goto("about:blank");
      // Now shutdown Puppeteer
      await super.teardown();
    }
    if (stopWebServer) {
      await stopWebServer();
    }
    if (stopGraphQlServer) {
      await stopGraphQlServer();
    }
    if (stopStubServer) {
      await stopStubServer();
    }
  }
}
