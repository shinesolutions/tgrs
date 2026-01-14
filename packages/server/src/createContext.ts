import { IncomingMessage } from "http";
import { Env, getDataSources } from ".";
import { Context } from "./context";
import { getUserFromAuthToken } from "shared";

/** get the auth from the context in local env. Extend as needed. */
export async function createContext(
  env: Env,
  request: IncomingMessage
): Promise<Context> {
  const token = request.headers.authorization || "";

  console.log("auth token is", token);

  return {
    user: getUserFromAuthToken(token),
    dataSources: getDataSources(env),
  };
}
