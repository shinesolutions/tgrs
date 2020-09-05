/**
 * Starts a server that can be used for local development outside of a lambda
 * function. We keep this file in the `scripts` directory rather than `src`
 * because it's for development only.
 */

import { ApolloServer } from "apollo-server";
// TODO Try deriving this type programmatically from one of the types exported
// from the package, rather than having to dig into the package's contents
import { ExpressContext as ExpressIntegrationContext } from "apollo-server/node_modules/apollo-server-express/src/ApolloServer";

import { createConfig } from "../src/config";

// In development, load the environment information directly from the filesystem
const env = require("../env.json");

const server = new ApolloServer(
  createConfig<ExpressIntegrationContext>(
    env,
    (integrationContext, headerName) =>
      integrationContext.req.header(headerName)
  )
);

server.listen().then(() => console.log("Ready!"));
