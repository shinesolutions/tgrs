/**
 * Starts a server that can be used for local development outside of a lambda
 * function. We keep this file in the `scripts` directory rather than `src`
 * because it's for development only.
 */

import { startApolloServer } from "..";


(async () => {
  // In development, load the environment information directly from the filesystem
  const env = require("../env.json");
  await startApolloServer(env);
  console.log("Ready!")
})()


