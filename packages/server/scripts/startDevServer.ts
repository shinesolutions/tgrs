/**
 * Starts a server that can be used for local development outside of a lambda
 * function. We keep this file in the `scripts` directory rather than `src`
 * because it's for development only.
 */

import { startApolloServer } from "..";
import { Value as JsonValue } from "json-typescript";
import { isArray, isBoolean, isNull, isNumber, isString } from "lodash";

(async () => {
  // In development, load the environment information directly from the
  // filesystem. Assume that it is a valid JSON value.
  const env: JsonValue = require("../env.json");

  // Check that the env JSON is a plain object
  if (
    isString(env) ||
    isBoolean(env) ||
    isNull(env) ||
    isArray(env) ||
    isNumber(env)
  ) {
    throw new Error(JSON.stringify(env));
  }

  await startApolloServer(env);
  console.log("Ready!");
})();
