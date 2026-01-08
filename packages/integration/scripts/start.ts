/**
 * Starts the integration environment on it's own, exposing the web server on
 * its default port. Useful for development and debugging.
 */

import {
  startWebServer,
  startGraphQlServer,
  defaultWebServerPort,
} from "../src";
import { startMockServer } from "../src/startMockServer";

import getPort from "get-port";

(async function () {
  const mockServerEndpoint = await startMockServer({
    targetPort: await getPort(),
  });

  const graphQlServerEndpoint = await startGraphQlServer({
    targetPort: await getPort(),
    stubbyEndpoint: mockServerEndpoint,
  });

  await startWebServer({
    targetPort: defaultWebServerPort,
    graphQlServerEndpoint,
  });
})();
