/**
 * Starts the integration environment on it's own, exposing the web server on
 * its default port. Useful for development and debugging.
 */

import {
  startWebServer,
  startGraphQlServer,
  startStubby,
  defaultWebServerPort,
} from "../src";

import getPort from "get-port";

(async function () {
  const stubbyEndpoint = await startStubby({
    targetPort: await getPort(),
  });

  const graphQlServerEndpoint = await startGraphQlServer({
    targetPort: await getPort(),
    stubbyEndpoint,
  });

  await startWebServer({
    targetPort: defaultWebServerPort,
    graphQlServerEndpoint,
  });
})();
