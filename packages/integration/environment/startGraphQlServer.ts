import { ApolloServer } from "../../server/node_modules/apollo-server";
import { createConfig } from "../../server/src/config";
import { ExpressIntegrationContext } from "../../server/src/express";
import { TargetPort } from "./TargetPort";
import { RunningServer } from "./RunningServer";
import { getRunningServer } from "./getRunningServer";
import { Endpoint } from "./Endpoint";

/**
 * Starts an instance of the GraphQL server that can be used for integration
 * testing
 */
export async function startGraphQlServer({
  targetPort,
  stubbyEndpoint,
}: {
  targetPort: TargetPort;
  stubbyEndpoint: Endpoint;
}): Promise<RunningServer> {
  const name = "GraphQL Server";
  console.log(`${name}: Starting...`);

  const { server } = await new ApolloServer(
    createConfig(
      {
        messageServerUrl: `http://${stubbyEndpoint.hostname}:${stubbyEndpoint.port}`,
      },
      ({ req }: ExpressIntegrationContext) => req.header("Authorization")
    )
  ).listen({ host: "127.0.0.1", port: targetPort });

  const runningServer = getRunningServer(server);
  const { stop, endpoint } = runningServer;

  // Shut down the server if somebody kills the process
  process.on("SIGINT", async () => {
    await stop();
    console.log(`${name}: Stopped`);
  });

  console.log(`${name}: Ready at ${endpoint.hostname}:${endpoint.port}`);

  return runningServer;
}
