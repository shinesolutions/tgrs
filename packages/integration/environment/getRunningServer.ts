import { promisify } from "util";
import http from "http";
import { RunningServer } from "./RunningServer";
import { getEndpoint } from "./getEndpoint";

/**
 * Takes a Node HTTP server object and returns an object for connecting to it
 * and stopping it
 */
export function getRunningServer(httpServer: http.Server): RunningServer {
  return {
    endpoint: getEndpoint(httpServer),
    stop: promisify(httpServer.close).bind(httpServer),
  };
}
