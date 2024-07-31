import { startLocalApolloServer } from "../../server";
import { TargetPort } from "./TargetPort";
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
}): Promise<Endpoint> {
  const name = "GraphQL Server";
  console.log(`${name}: Starting...`);

  const hostname = "127.0.0.1";

  await startLocalApolloServer(
    {
      messageServerUrl: `http://${stubbyEndpoint.hostname}:${stubbyEndpoint.port}`,
    },
    { host: hostname, port: targetPort }
  );

  console.log(`${name}: Ready at ${hostname}:${targetPort}`);

  return { hostname, port: targetPort };
}
