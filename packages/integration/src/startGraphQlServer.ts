import { startLocalApolloServer } from "../../server";
import { TargetPort } from "./TargetPort";
import { Endpoint } from "./Endpoint";

/**
 * Starts an instance of the GraphQL server that can be used for integration
 * testing
 */
export async function startGraphQlServer({
  targetPort,
  mockServerEndpoint,
}: {
  targetPort: TargetPort;
  mockServerEndpoint: Endpoint;
}): Promise<Endpoint> {
  const name = "GraphQL Server";
  console.log(`${name}: Starting...`);

  const hostname = "127.0.0.1";

  await startLocalApolloServer(
    {
      messageServerUrl: `http://${mockServerEndpoint.hostname}:${mockServerEndpoint.port}`,
    },
    { host: hostname, port: targetPort }
  );

  console.log(`${name}: Ready at ${hostname}:${targetPort}`);

  return { hostname, port: targetPort };
}
