import { ApolloServer, ServerInfo } from "apollo-server";
import { GraphQLClient } from "graphql-request";
import { createConfig } from "./config";
import { Stubby, StubbyData } from "stubby";
import { promisify } from "util";
import * as yaml from "js-yaml";
import fs from "fs";
import path from "path";
import jwt from "jwt-simple";
import { isNull, isString, isUndefined } from "lodash";

let serverInfo: ServerInfo;
let stubby: Stubby;
let graphQlClient: GraphQLClient;

beforeAll(async () => {
  stubby = new Stubby();

  const data = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, "..", "stubby.yaml"), "utf-8")
  );

  if (isUndefined(data) || isString(data)) {
    throw new Error(data);
  }

  await new Promise((resolve, reject) =>
    stubby.start(
      {
        // Start all stubby services on ephemeral ports to avoid port conflicts
        stubs: 0,
        admin: 0,
        tls: 0,
        data: data as StubbyData,
      },
      (err) => (err ? reject(err) : resolve())
    )
  );
  const address = stubby.stubsPortal.address();

  if (isNull(address) || isString(address)) {
    throw new Error(JSON.stringify(address));
  }
  const { address: stubAddress, port: stubPort } = address;

  const apolloServer = new ApolloServer(
    createConfig(
      // Set the Apollo config to use the details of where the stub is running
      { messageServerUrl: `http://${stubAddress}:${stubPort}` },
      (integrationContext, headerName) =>
        // Because we're running in Express, extract headers from Express
        // requests
        integrationContext.req.header(headerName)
    )
  );

  // Start Apollo Server on ephemeral port to avoid port conflicts
  serverInfo = await apolloServer.listen({ port: 0 });

  // Set up a client that can contact the GraphQL server. All requests that
  // the client makes should include an encoded authorization header.
  graphQlClient = new GraphQLClient(serverInfo.url, {
    headers: {
      Authorization: jwt.encode({ name: "Ben" }, "DummySecret"),
    },
  });
});

test("greeting", async () => {
  const data = await graphQlClient.request(
    `query { greeting(language: ENGLISH) }`
  );
  expect(data.greeting).toEqual("Hello, Ben!");
});

afterAll(async () => {
  await promisify(stubby.stop).bind(stubby)();
  const { server } = serverInfo;
  await promisify(server.close).bind(server)();
});
