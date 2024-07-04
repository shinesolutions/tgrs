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
} from "../src";

(async function () {
  // const stubbyServer = await startStubby({
  //   targetPort: ephemeralPort,
  // });
  const ep = {hostname: "127.0.0.1", port: 0}; //hardcoded, as the above doesnt work

  const graphQlServerEndpoint = (
    await startGraphQlServer({
      targetPort: ephemeralPort,
      stubbyEndpoint: ep,
    })
  ).endpoint;

  await startWebServer({
    targetPort: defaultWebServerPort,
    graphQlServerEndpoint,
  });
})();
