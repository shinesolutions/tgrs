import express, { Request, Response } from "express";
import { TargetPort } from "./TargetPort";
import { Endpoint } from "./Endpoint";
import { mockRoutes } from "./mockData";

/**
 * Starts a simple Express-based mock server
 * Uses declarative route configuration from mockData.ts, akin to Stubby
 * @param {./TargetPort} targetPort the port to run the server on
 * @return {Promise} resolves with the endpoint the server is running on
 */
export async function startMockServer({
  targetPort,
}: {
  targetPort: TargetPort;
}): Promise<Endpoint> {
  const name = `Mock Server`;

  console.log(`${name}: Starting...`);

  const app = express();
  const hostname = "127.0.0.1";

  app.use(express.json());

  // Register all routes from the declarative config
  mockRoutes.forEach((route) => {
    // handle the request and send the response
    const handler = (_req: Request, res: Response) => {
      // Set custom headers if provided
      if (route.response.headers) {
        Object.entries(route.response.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      res.status(route.response.status);
      res.send(route.response.body);
    };

    const matcher = route.request.url;

    // Register the route based on HTTP method
    switch (route.request.method) {
      case "GET":
        app.get(matcher, handler);
        break;
      case "POST":
        app.post(matcher, handler);
        break;
      case "PUT":
        app.put(matcher, handler);
        break;
      case "DELETE":
        app.delete(matcher, handler);
        break;
      case "PATCH":
        app.patch(matcher, handler);
        break;
    }
  });

  const server = app.listen(targetPort, hostname);

  process.on("SIGINT", async () => {
    server.close();
    console.log(`${name}: Stopped`);
  });

  console.log(`${name}: Ready at ${hostname}:${targetPort}`);

  return { hostname, port: targetPort };
}
