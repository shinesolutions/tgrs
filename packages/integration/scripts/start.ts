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
import { readFile } from "fs/promises";
import { join } from "path";
import getPort from "get-port";

interface EnvConfig {
  messageServerUrl?: string;
}

/**
 * Reads the port number from env.integration.json file.
 * Extracts the port from the messageServerUrl field.
 */
async function getPortFromEnv(): Promise<number | undefined> {
  try {
    const envPath = join(__dirname, "../../server/env.integration.json");
    const envContent = await readFile(envPath, "utf-8");
    const env: EnvConfig = JSON.parse(envContent);

    if (env.messageServerUrl) {
      const url = new URL(env.messageServerUrl);
      return parseInt(url.port);
    }
  } catch (error) {
    console.warn("Could not read port from env.integration.json:", error);
  }
  return undefined;
}

(async function () {
  const envPort = await getPortFromEnv();

  if (!envPort) {
    console.error(
      "!! Error !! getting port from server's env.integration.json. Ensure that messageServerUrl is set correctly in server according to the following port:"
    );
  }

  const targetPort = await getPort({ port: envPort });

  console.log("port:", targetPort);

  const mockServerEndpoint = await startMockServer({
    targetPort,
  });

  const graphQlServerEndpoint = await startGraphQlServer({
    targetPort: await getPort(),
    mockServerEndpoint,
  });

  await startWebServer({
    targetPort: defaultWebServerPort,
    graphQlServerEndpoint,
  });
})();
