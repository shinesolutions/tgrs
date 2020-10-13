import { ApolloServer, ServerInfo } from "apollo-server";
import { GraphQLClient } from "graphql-request";
import { createConfig } from "./config";
import { promisify } from "util";
import jwt from "jwt-simple";
import { ExpressIntegrationContext } from "./express";
import { rest } from "msw";
import { setupServer } from "msw/node";

const messageServerUrl = "http://messageServer";
const messageServer = setupServer(
  rest.get(messageServerUrl, (_, res, ctx) => res(ctx.body("Hello")))
);

let apolloServerInfo: ServerInfo;

let loggedOutGraphQlClient: GraphQLClient;
let loggedInGraphQlClient: GraphQLClient;

beforeAll(async () => {
  messageServer.listen();

  const apolloServer = new ApolloServer(
    createConfig(
      { messageServerUrl },
      (integrationContext: ExpressIntegrationContext, headerName) =>
        // Because we're running in Express, extract headers from Express
        // requests
        integrationContext.req.header(headerName)
    )
  );

  // Start Apollo Server on ephemeral port to avoid port conflicts
  apolloServerInfo = await apolloServer.listen({ port: 0 });

  // Set up a client that can contact the GraphQL server as a logged-out user
  loggedOutGraphQlClient = new GraphQLClient(apolloServerInfo.url);

  // Set up a client that can contact the GraphQL server as a logged-in user
  loggedInGraphQlClient = new GraphQLClient(apolloServerInfo.url, {
    headers: {
      Authorization: jwt.encode({ name: "Ben" }, "DummySecret"),
    },
  });
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  messageServer.resetHandlers();
});

afterAll(async () => {
  messageServer.close();

  const { server: apolloServer } = apolloServerInfo;
  await promisify(apolloServer.close).bind(apolloServer)();
});

describe("personalizedGreeting", () => {
  it("should be accessible to a logged-in user", async () => {
    const data = await loggedInGraphQlClient.request(
      `query { personalizedGreeting(language: ENGLISH) }`
    );
    expect(data.personalizedGreeting).toEqual("Hello, Ben!");
  });

  it("should not be accessible to a logged-out user", async () => {
    expect(() =>
      loggedOutGraphQlClient.request(
        `query { personalizedGreeting(language: ENGLISH) }`
      )
    ).rejects.toThrow();
  });
});

describe("greeting", () => {
  it("should be accessible to a logged-in user", async () => {
    const data = await loggedOutGraphQlClient.request(
      `query { greeting(language: ENGLISH) }`
    );
    expect(data.greeting).toEqual("Hello!");
  });

  it("should be accessible to a logged-in user", async () => {
    const data = await loggedInGraphQlClient.request(
      `query { greeting(language: ENGLISH) }`
    );
    expect(data.greeting).toEqual("Hello!");
  });
});
