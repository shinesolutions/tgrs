/**
 * Starts a server that can be used for local development outside of a lambda
 * function. We keep this file in the `scripts` directory rather than `src`
 * because it's for development only.
 */

import { startLocalApolloServer } from "..";
import { envSchema } from "../src";

(async () => {
  // In development, load the environment information directly from the
  // filesystem and validate it with Zod
  const rawEnv = require("../env.json");

  // Validate and parse the environment configuration
  const env = envSchema.parse(rawEnv);

  const serverInfo = await startLocalApolloServer(env, { port: 4000 });
  console.log(`🚀 on ${serverInfo.url}`);
})();
