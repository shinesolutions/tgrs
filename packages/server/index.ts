import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { createConfig, Env } from "./src";
import { ListenOptions } from "net";
import { createContext } from "./src/createContext";

/**
 * Starts a stand-alone instance of Apollo Server
 *
 * @param env the env variables to be used by the instance
 * @param listenOptions the listening options to be used by the instance
 */
export function startLocalApolloServer(env: Env, listenOptions: ListenOptions) {
  const server = new ApolloServer({
    ...createConfig(),
    introspection: true,
  });
  return startStandaloneServer(server, {
    context: ({ req }) => createContext(env, req),
    listen: listenOptions,
  });
}
