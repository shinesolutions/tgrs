import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { IncomingMessage } from "http";

// TODO Try deriving this type programmatically from one of the types exported
// from the "apollo-server" package, rather than having to dig into the
// contents of the `apollo-server-express` package.

import { createConfig, Env, getDataSources } from "./src";
import { ListenOptions } from "net";
import { BaseContext, Context } from "./src/context";

/**
 * Starts a stand-alone instance of Apollo Server
 *
 * @param env the env variables to be used by the instance
 * @param listenOptions the listening options to be used by the instance
 */
export function startLocalApolloServer(env: Env, listenOptions: ListenOptions) {
  const server = new ApolloServer({
    ...createConfig(
      env,
      (integrationContext: any, headerName) =>
        integrationContext.req.header(headerName)
    ),
    introspection: true
  });
  return startStandaloneServer(server, {
    context: async ({ req }) => {
      return contextLocal(env, req);
    },
    listen: listenOptions,
  });
}

/** get the auth from the context in local env. Extend as needed. */
export async function contextLocal(env: Env, request: IncomingMessage): Promise<Context> {
  const token = request.headers.authorization || "";

  console.log("auth token is", token);

  return {
    user: {
      name: token
    },
    dataSources: getDataSources(env)
  };
}
