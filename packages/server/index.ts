import { ApolloServer } from "apollo-server";

// TODO Try deriving this type programmatically from one of the types exported
// from the "apollo-server" package, rather than having to dig into the
// contents of the `apollo-server-express` package.
import { ExpressContext as ExpressIntegrationContext } from "apollo-server-express/dist/ApolloServer";

import { createConfig, Env } from "./src";
import { ListenOptions } from "net";

/**
 * Starts a stand-alone instance of Apollo Server
 *
 * @param env the env variables to be used by the instance
 * @param listenOptions the listening options to be used by the instance
 */
export function startApolloServer(env: Env, listenOptions?: ListenOptions) {
  return new ApolloServer(
    createConfig(
      env,
      (integrationContext: ExpressIntegrationContext, headerName) =>
        integrationContext.req.header(headerName)
    )
  ).listen(listenOptions);
}
