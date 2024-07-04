import { startLocalApolloServer } from "../../server";
import { TargetPort } from "./TargetPort";
import { RunningServer } from "./RunningServer";
import { Endpoint } from "./Endpoint";
import { getRunningServer } from "./getRunningServer";
// import { getRunningServer } from "./getRunningServer";

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

  const server = await startLocalApolloServer(
    {
      messageServerUrl: `http://${stubbyEndpoint.hostname}:${stubbyEndpoint.port}`,
    },
    { host: "127.0.0.1", port: targetPort }
  );

  // const runningServer = getRunningServer(server);
  const { url: endpoint } = server;

  // Shut down the server if somebody kills the process
  // process.on("SIGINT", async () => {
  //   await stop();
  //   console.log(`${name}: Stopped`);
  // });

  console.log(`${name}: Ready at ${endpoint}`);

  return {
    endpoint: { hostname: stubbyEndpoint.hostname, port: stubbyEndpoint.port },
    stop: async () => console.log("non-working function!"),
  };
}
