/**
 * Starts a server that can be used for local development outside of a lambda
 * function. We keep this file in the `scripts` directory rather than `src`
 * because it's for development only.
 */

import { ApolloServer } from "apollo-server";
import { createConfig } from "../src/config";
import { ExpressIntegrationContext } from "../src/ExpressIntegrationContext";

// In development, load the environment information directly from the filesystem
const env = require("../env.json");

const server = new ApolloServer(
  createConfig(
    env,
    (integrationContext: ExpressIntegrationContext, headerName) =>
      integrationContext.req.header(headerName)
  )
);

server.listen().then(() => console.log("Ready!"));
