import express from "express";
import handler from "serve-handler";
import http from "http";
import { TargetPort } from "./TargetPort";
import { Endpoint } from "./Endpoint";
import { SignJWT } from "jose";

/**
 * Starts up a web server that serves up the built version of the web
 * application, as well as an environment config file
 */
export async function startWebServer({
  targetPort,
  graphQlServerEndpoint,
}: {
  targetPort: TargetPort;
  graphQlServerEndpoint: Endpoint;
}): Promise<Endpoint> {
  const name = "Web Server";

  console.log(`${name}: Starting...`);

  const app = express();

  // When requested, dynamically generate the environment file
  app.get("/env.json", async (_, res) => {
    // Just use a dummy key, as tokens won't be verified in this environment
    const secret = new TextEncoder().encode("dummySecret");
    const integrationAuthToken = await new SignJWT({ name: "John Doe" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    res.send({
      integrationAuthToken,
      serverUri: `http://${graphQlServerEndpoint.hostname}:${graphQlServerEndpoint.port}`,
    });
  });

  app.use(express.json());

  app.use((req, res) =>
    handler(req, res, {
      public: "../client/build",
      // As the routing is all being done on the client, any request whose path
      // has not already matched an existing resource should just get the index
      // page
      rewrites: [{ source: "**", destination: "index.html" }],
    })
  );

  const server = http.createServer(app);

  const hostname = "127.0.0.1";
  await new Promise((resolve) =>
    server.listen({ host: hostname, port: targetPort }, () => resolve("Ready"))
  );

  function close() {
    server.close(() => {
      console.log(`${name}: Stopped`);
    });
  }

  // Shut down the server if somebody kills the process
  process.on("SIGTERM", close);
  process.on("SIGINT", close);

  console.log(`${name}: Ready at ${hostname}:${targetPort}`);

  return { hostname, port: targetPort };
}
