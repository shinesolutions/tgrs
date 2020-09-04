const { ApolloServer } = require("apollo-server");
const { GraphQLClient } = require("graphql-request");
const { createConfig } = require("./config");
const { Stubby } = require("stubby");
const { promisify } = require("util");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const jwt = require("jwt-simple");

let serverInfo;
let stubby;
let graphQlClient;

beforeAll(async () => {
  stubby = new Stubby();

  // Start all stubby services on ephemeral ports to avoid port conflicts
  await promisify(stubby.start).bind(stubby)({
    stubs: 0,
    admin: 0,
    tls: 0,
    data: yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, "..", "stubby.yaml"))
    ),
  });
  const { address: stubAddress, port: stubPort } = stubby.stubsPortal.address();

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
  const data = await graphQlClient.request(`{ greeting }`);
  expect(data.greeting).toEqual("Hello, Ben!");
});

afterAll(async () => {
  await promisify(stubby.stop).bind(stubby)();
  const { server } = serverInfo;
  await promisify(server.close).bind(server)();
});
