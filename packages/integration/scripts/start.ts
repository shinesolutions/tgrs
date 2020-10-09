/**
 * Starts the integration environment on it's own, exposing the web server on
 * its default port. Useful for development and debugging.
 */

import {
  startWebServer,
  startGraphQlServer,
  startStubby,
  defaultWebServerPort,
  ephemeralPort,
} from "../environment";

(async function () {
  const stubbyServer = await startStubby({
    targetPort: ephemeralPort,
  });

  const graphQlServerEndpoint = (
    await startGraphQlServer({
      targetPort: ephemeralPort,
      stubbyEndpoint: stubbyServer.endpoint,
    })
  ).endpoint;

  await startWebServer({
    targetPort: defaultWebServerPort,
    graphQlServerEndpoint,
  });
})();
