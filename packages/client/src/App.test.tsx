import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { render, waitFor, screen } from "@testing-library/react";
import App from "./App";
import { setupServer } from "msw/node";
import { graphql } from "msw";

// Setup requests interception using the given handlers.
const server = setupServer();

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});

describe("App", () => {
  it("renders learn react link", async () => {
    server.use(
      graphql.query("AppQuery", (_, res, ctx) =>
        res(
          ctx.data({
            personalizedGreeting: "Hello, Unit Test!",
          })
        )
      )
    );

    render(
      <ApolloProvider
        client={
          new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink(),
          })
        }
      >
        <App />
      </ApolloProvider>
    );
    const heading = await waitFor(() => screen.getByRole("heading"));
    expect(heading).toHaveTextContent("Hello, Unit Test!");
  });
});
