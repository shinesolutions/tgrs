import { isNull, isString } from "lodash";
import * as http from "http";
import { Endpoint } from "./Endpoint";

/**
 * Takes a Node HTTP server object and returns the endpoint info for it
 */
export function getEndpoint(httpServer: http.Server): Endpoint {
  const addressInfo = httpServer.address();

  if (isNull(addressInfo) || isString(addressInfo)) {
    throw new Error(JSON.stringify(addressInfo));
  }

  return { hostname: addressInfo.address, port: addressInfo.port };
}
