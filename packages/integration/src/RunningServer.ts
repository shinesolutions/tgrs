import { Endpoint } from "./Endpoint";
import { StopServer } from "./StopServer";

/**
 * An object that can be used to inspect and interact with the running server
 */
export interface RunningServer {
  // The endpoint that the server can be contacted on
  endpoint: Endpoint;
  // A function that will stop the server
  stop: StopServer;
}
